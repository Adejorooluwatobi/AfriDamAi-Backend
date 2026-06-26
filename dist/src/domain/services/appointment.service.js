"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppointmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const appointment_entity_1 = require("../entities/appointment.entity");
const client_1 = require("@prisma/client");
const subscription_service_1 = require("./subscription.service");
const app_gateway_1 = require("../../shared/websockets/app.gateway");
const notification_service_1 = require("./notification.service");
const admin_service_1 = require("./admin.service");
const specialist_service_1 = require("./specialist.service");
const specialist_assignment_service_1 = require("./specialist-assignment.service");
const subscription_validation_service_1 = require("./subscription-validation.service");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const wallet_service_1 = require("./wallet.service");
const wallet_transaction_service_1 = require("./wallet-transaction.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
const admin_notification_service_1 = require("./admin-notification.service");
const google_meet_service_1 = require("./google-meet.service");
let AppointmentService = AppointmentService_1 = class AppointmentService {
    constructor(appointmentRepository, transactionRepository, subscriptionService, subscriptionValidationService, appGateway, notificationService, adminService, specialistService, specialistAssignmentService, prisma, walletService, walletTransactionService, mailService, adminNotificationService, googleMeetService) {
        this.appointmentRepository = appointmentRepository;
        this.transactionRepository = transactionRepository;
        this.subscriptionService = subscriptionService;
        this.subscriptionValidationService = subscriptionValidationService;
        this.appGateway = appGateway;
        this.notificationService = notificationService;
        this.adminService = adminService;
        this.specialistService = specialistService;
        this.specialistAssignmentService = specialistAssignmentService;
        this.prisma = prisma;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.mailService = mailService;
        this.adminNotificationService = adminNotificationService;
        this.googleMeetService = googleMeetService;
        this.logger = new common_1.Logger(AppointmentService_1.name);
    }
    async createAppointment(params) {
        const eligibility = await this.subscriptionValidationService.validateSubscriptionForAppointment(params.userId);
        if (!eligibility.eligible) {
            throw new common_1.BadRequestException(eligibility.reason);
        }
        const userSubscription = eligibility.subscription;
        const plan = userSubscription.pricingPlan;
        const appointmentEntity = new appointment_entity_1.Appointment({
            id: '',
            userId: params.userId,
            subscriptionId: userSubscription.id,
            specialty: params.specialty,
            type: plan.type,
            status: client_1.AppointmentStatus.PENDING,
            price: plan.price,
            scheduledAt: params.scheduledAt,
            notes: params.notes,
            specialistId: params.specialistId,
            organizationId: params.organizationId,
        });
        const newAppointment = await this.appointmentRepository.create(appointmentEntity);
        const user = await this.prisma.user.findUnique({ where: { id: params.userId } });
        try {
            const transaction = await this.transactionRepository.create({
                userId: params.userId,
                appointmentId: newAppointment.id,
                amount: plan.price,
                status: client_1.TransactionStatus.PENDING,
                gateway: client_1.PaymentGateway.PAYSTACK,
            });
            if (user && user.email) {
                await this.mailService.sendAppointmentCreatedEmail(user.email, newAppointment);
            }
            await this.notifyOperationsAdmins(newAppointment);
            this.logger.log(`Operations admins notified for new PENDING appointment ${newAppointment.id}`);
            if (params.specialty === client_1.SpecialtyTier.DERMATOLOGIST) {
                this.logger.log(`Appointment ${newAppointment.id} is for a DERMATOLOGIST. Routing to Admins only. Skipped broadcast.`);
            }
            else {
                try {
                    if (!params.organizationId) {
                        await this.specialistAssignmentService.broadcastAppointmentToSpecialists(newAppointment.id);
                    }
                    else {
                        this.logger.log(`B2B Appointment created: ${newAppointment.id}. Waiting for Facility Admin assignment. Skipped broadcast.`);
                    }
                }
                catch (broadcastError) {
                    this.logger.error(`Broadcast failed for appointment ${newAppointment.id}`, broadcastError);
                }
            }
            return {
                ...newAppointment,
                transactionId: transaction.id,
                checkoutUrl: `/api/transactions/pay/${transaction.id}`
            };
        }
        catch (error) {
            this.logger.error('Failed to initialize transaction for appointment', error);
            throw new common_1.InternalServerErrorException('Could not initialize payment gateway');
        }
    }
    async findAll() {
        return this.appointmentRepository.findAll();
    }
    async getUserAppointments(userId) {
        return this.appointmentRepository.findByUserId(userId);
    }
    async getSpecialistAppointments(specialistId) {
        return this.appointmentRepository.findBySpecialistId(specialistId, [
            client_1.AppointmentStatus.CONFIRMED,
            client_1.AppointmentStatus.IN_PROGRESS,
        ]);
    }
    async updateAppointmentStatus(id, status) {
        const updateParams = { status: status };
        const updatedAppointment = await this.appointmentRepository.update(id, updateParams);
        if (updatedAppointment.status === client_1.AppointmentStatus.CONFIRMED) {
            this.logger.log(`Appointment ${id} status changed to CONFIRMED. Sending notifications.`);
            await this.notifyOperationsAdmins(updatedAppointment, 'Appointment Confirmed!', `Appointment ID: ${updatedAppointment.id} has been confirmed and scheduled.`);
            if (updatedAppointment.specialistId) {
                const { specialist } = await this.specialistService.findById(updatedAppointment.specialistId);
                if (specialist) {
                    const title = 'New Appointment Assigned!';
                    const message = `You have been assigned to appointment ID: ${updatedAppointment.id}. Scheduled for: ${updatedAppointment.scheduledAt}.`;
                    await this.notificationService.createNotification({
                        specialistId: specialist.id,
                        title,
                        message,
                    });
                    this.appGateway.sendToUser(specialist.id, 'newNotification', { title, message, appointmentId: updatedAppointment.id, type: 'assignedAppointmentSpecialist' });
                }
            }
        }
        return updatedAppointment;
    }
    async scheduleAppointment(id, scheduledAt, notes, specialistId) {
        const updateParams = {
            scheduledAt,
            notes,
            status: client_1.AppointmentStatus.CONFIRMED,
            specialistId,
        };
        const updatedAppointment = await this.appointmentRepository.update(id, updateParams);
        this.logger.log(`Appointment ${id} scheduled and confirmed. Sending notifications.`);
        await this.notifyOperationsAdmins(updatedAppointment, 'Appointment Scheduled!', `Appointment ID: ${updatedAppointment.id} has been scheduled for ${scheduledAt}.`);
        if (updatedAppointment.specialistId) {
            const { specialist } = await this.specialistService.findById(updatedAppointment.specialistId);
            if (specialist) {
                const title = 'Your Appointment is Scheduled!';
                const message = `You have been assigned to appointment ID: ${updatedAppointment.id}. Scheduled for: ${updatedAppointment.scheduledAt}.`;
                await this.notificationService.createNotification({
                    specialistId: specialist.id,
                    title,
                    message,
                });
                this.appGateway.sendToUser(specialist.id, 'newNotification', { title, message, appointmentId: updatedAppointment.id, type: 'scheduledAppointmentSpecialist' });
            }
        }
        return updatedAppointment;
    }
    async confirmPaymentAndActivate(appointmentId, transactionId) {
        await this.appointmentRepository.update(appointmentId, {
            status: client_1.AppointmentStatus.CONFIRMED
        });
    }
    async notifyOperationsAdmins(appointment, title = 'New Appointment Request', message) {
        const admins = await this.adminService.findAllAdmin();
        const operationsAdmins = admins.filter(admin => admin.isActive && (admin.type === client_1.AdminType.OPERATIONS_ADMIN || admin.type === client_1.AdminType.SUPER_ADMIN));
        const defaultMessage = message || `User ${appointment.userId} has booked a new appointment with ID: ${appointment.id}. Please assign a specialist.`;
        await this.adminNotificationService.notify('APPOINTMENT', title, `<p>${defaultMessage}</p>
       <p><strong>Appointment ID:</strong> ${appointment.id}</p>
       <p><strong>Specialty:</strong> ${appointment.specialty}</p>
       <p><strong>Scheduled At:</strong> ${appointment.scheduledAt}</p>`, false);
        for (const admin of operationsAdmins) {
            await this.notificationService.createNotification({
                adminId: admin.id,
                title,
                message: defaultMessage,
            });
            this.appGateway.sendToUser(admin.id, 'newNotification', {
                title,
                message: defaultMessage,
                appointmentId: appointment.id,
                type: 'newAppointmentAdmin'
            });
        }
    }
    async completeAppointment(appointmentId, userId, isSpecialist = false) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { user: true, specialist: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status !== client_1.AppointmentStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed appointments can be completed');
        }
        if (userId !== 'SYSTEM') {
            if (!isSpecialist && appointment.userId !== userId) {
                throw new common_1.ForbiddenException('You can only complete your own appointments');
            }
            if (isSpecialist && appointment.specialistId !== userId) {
                throw new common_1.ForbiddenException('You can only complete appointments assigned to you');
            }
        }
        const updated = await this.appointmentRepository.update(appointmentId, {
            status: client_1.AppointmentStatus.COMPLETED,
        });
        await this.finalizeAppointment(appointmentId);
        return updated;
    }
    async finalizeAppointment(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { user: true, specialist: true },
        });
        if (!appointment)
            return;
        let pricingPlan = null;
        if (appointment.subscriptionId) {
            try {
                const subWithPlan = await this.subscriptionService.getSubscriptionById(appointment.subscriptionId);
                const plan = subWithPlan.pricingPlan;
                pricingPlan = plan;
                if (plan.isInstantSession) {
                    await this.subscriptionService.endInstantSession(appointment.subscriptionId);
                    this.logger.log(`Instant session ${appointment.subscriptionId} ended upon completion.`);
                }
                else if (plan.appointmentLimit !== null && plan.appointmentLimit > 0) {
                    if (subWithPlan.remainingSessions !== null && subWithPlan.remainingSessions > 0) {
                        await this.subscriptionService.decrementRemainingSessions(appointment.subscriptionId);
                        this.logger.log(`Session decremented for subscription ${appointment.subscriptionId} upon completion.`);
                    }
                    else {
                        this.logger.warn(`Subscription ${appointment.subscriptionId} has no remaining sessions to deduct at completion.`);
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to deduct sessions for subscription ${appointment.subscriptionId}`, error);
            }
        }
        if (appointment.specialistId) {
            await this.prisma.specialist.update({
                where: { id: appointment.specialistId },
                data: { completedAppointments: { increment: 1 } },
            });
            this.logger.log(`Incremented completed appointments for specialist ${appointment.specialistId}`);
            if (appointment.price && appointment.price > 0) {
                const existingTransactions = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(appointment.id, client_1.WalletRelatedEntityType.APPOINTMENT);
                let isAlreadyPaidOut = false;
                if (existingTransactions && existingTransactions.length > 0) {
                    const payoutTx = existingTransactions.find(tx => tx.type === client_1.WalletTransactionType.CREDIT);
                    if (payoutTx) {
                        isAlreadyPaidOut = true;
                        this.logger.log(`Appointment ${appointment.id} already paid out. Skipping duplicate payout...`);
                    }
                }
                if (!isAlreadyPaidOut) {
                    let commissionAmount = 0;
                    if (pricingPlan && appointment.specialist.type) {
                        commissionAmount = await this.calculateSpecialistPayout(pricingPlan, appointment.specialist.type, appointment.userId, appointment.specialistId);
                        this.logger.log(`Calculated dynamic payout: ${commissionAmount} for plan price ${pricingPlan.price} and type ${appointment.specialist.type}`);
                    }
                    else {
                        commissionAmount = appointment.price * 0.1;
                        this.logger.warn(`Using fallback 10% commission: ${commissionAmount}. Plan or Type missing.`);
                    }
                    const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
                    if (superAdmins.length === 0) {
                        this.logger.error('No SUPER_ADMIN found to link Organization Wallet for specialist payout debit.');
                    }
                    else {
                        const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
                        let organizationWallet;
                        try {
                            organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, client_1.WalletOwnerType.ORGANIZATION);
                        }
                        catch (error) {
                            if (error instanceof common_1.NotFoundException) {
                                organizationWallet = await this.walletService.createWallet({
                                    ownerId: ORGANIZATION_ADMIN_ID,
                                    ownerType: client_1.WalletOwnerType.ORGANIZATION,
                                    initialBalance: 0,
                                });
                                this.logger.log(`Created Organization Wallet during specialist payout: ${organizationWallet.id}`);
                            }
                            else {
                                this.logger.error(`Error retrieving Org wallet for specialist payout: ${error.message}`);
                            }
                        }
                        if (organizationWallet) {
                            await this.walletService.debitWallet(organizationWallet.id, commissionAmount);
                            await this.walletTransactionService.createWalletTransaction({
                                walletId: organizationWallet.id,
                                type: client_1.WalletTransactionType.DEBIT,
                                amount: commissionAmount,
                                description: `Payout to Specialist ${appointment.specialistId} for Appointment #${appointment.id}`,
                                relatedEntityId: appointment.id,
                                relatedEntityType: client_1.WalletRelatedEntityType.APPOINTMENT,
                            });
                            this.logger.log(`Organization wallet ${organizationWallet.id} debited ${commissionAmount} for specialist payout.`);
                        }
                    }
                    let specialistWallet;
                    try {
                        specialistWallet = await this.walletService.getWalletByOwner(appointment.specialistId, client_1.WalletOwnerType.SPECIALIST);
                    }
                    catch (error) {
                        if (error instanceof common_1.NotFoundException) {
                            specialistWallet = await this.walletService.createWallet({
                                ownerId: appointment.specialistId,
                                ownerType: client_1.WalletOwnerType.SPECIALIST,
                                initialBalance: 0,
                            });
                            this.logger.log(`Created Specialist Wallet during payout: ${specialistWallet.id} for specialist ${appointment.specialistId}`);
                        }
                        else {
                            throw error;
                        }
                    }
                    await this.walletService.creditWallet(specialistWallet.id, commissionAmount);
                    await this.walletTransactionService.createWalletTransaction({
                        walletId: specialistWallet.id,
                        type: client_1.WalletTransactionType.CREDIT,
                        amount: commissionAmount,
                        description: `Payout for Appointment #${appointment.id}`,
                        relatedEntityId: appointment.id,
                        relatedEntityType: client_1.WalletRelatedEntityType.APPOINTMENT,
                    });
                    this.logger.log(`Credited specialist ${appointment.specialistId} with ${commissionAmount} for appointment ${appointment.id}`);
                }
            }
        }
        const title = 'Appointment Completed';
        const userMessage = 'Your appointment has been marked as completed. Thank you!';
        const specialistMessage = `Appointment with ${appointment.user.firstName} ${appointment.user.lastName} has been completed.`;
        await this.notificationService.createNotification({
            userId: appointment.userId,
            title,
            message: userMessage,
        });
        this.appGateway.sendToUser(appointment.userId, 'newNotification', {
            title,
            message: userMessage,
            appointmentId,
            type: 'appointmentCompleted',
        });
        if (appointment.specialistId) {
            await this.notificationService.createNotification({
                specialistId: appointment.specialistId,
                title,
                message: specialistMessage,
            });
            this.appGateway.sendToUser(appointment.specialistId, 'newNotification', {
                title,
                message: specialistMessage,
                appointmentId,
                type: 'appointmentCompleted',
            });
        }
        this.logger.log(`Business logic finalized for appointment ${appointmentId}`);
    }
    async cancelAppointment(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own appointments');
        }
        const updated = await this.appointmentRepository.update(appointmentId, {
            status: client_1.AppointmentStatus.CANCELLED,
        });
        return updated;
    }
    async getActiveAppointmentBetween(requesterId, otherUserId) {
        const appointment = await this.prisma.appointment.findFirst({
            where: {
                AND: [
                    { status: { in: [client_1.AppointmentStatus.CONFIRMED, client_1.AppointmentStatus.IN_PROGRESS] } },
                    {
                        OR: [
                            { userId: requesterId, specialistId: otherUserId },
                            { userId: otherUserId, specialistId: requesterId },
                        ],
                    },
                ],
            },
            include: { user: true, specialist: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('No active appointment found between these participants.');
        }
        return appointment;
    }
    async createMeetingForParticipants(requesterId, otherUserId) {
        const appointment = await this.getActiveAppointmentBetween(requesterId, otherUserId);
        if (appointment.meetingLink) {
            this.logger.log(`Re-using existing Meet link for appointment ${appointment.id}`);
            this.broadcastMeetLink(appointment.id, appointment.meetingLink, appointment.userId, appointment.specialistId);
            return { meetLink: appointment.meetingLink, appointmentId: appointment.id };
        }
        const meetLink = await this.googleMeetService.createMeetSpace();
        if (!meetLink) {
            throw new common_1.InternalServerErrorException('Failed to generate Google Meet link. Check Google Meet service configuration.');
        }
        await this.appointmentRepository.update(appointment.id, { meetingLink: meetLink });
        this.logger.log(`Meet link saved for appointment ${appointment.id}: ${meetLink}`);
        this.broadcastMeetLink(appointment.id, meetLink, appointment.userId, appointment.specialistId);
        return { meetLink, appointmentId: appointment.id };
    }
    broadcastMeetLink(appointmentId, meetLink, userId, specialistId) {
        const payload = { appointmentId, meetLink, type: 'meetingLinkCreated' };
        this.appGateway.sendToUser(userId, 'meetingLinkCreated', payload);
        if (specialistId) {
            this.appGateway.sendToUser(specialistId, 'meetingLinkCreated', payload);
        }
        this.logger.log(`Broadcasted meetingLinkCreated to user ${userId} and specialist ${specialistId}`);
    }
    async getAppointmentById(appointmentId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async startSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status !== client_1.AppointmentStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed appointments can be started');
        }
        if (appointment.userId !== userId && appointment.specialistId !== userId) {
            throw new common_1.ForbiddenException('You are not a participant in this appointment');
        }
        if (appointment.startedAt) {
            const existingChat = await this.prisma.chat.findFirst({
                where: {
                    OR: [
                        { participant1Id: appointment.specialistId, participant2Id: appointment.userId },
                        { participant1Id: appointment.userId, participant2Id: appointment.specialistId },
                    ],
                },
            });
            return { ...appointment, chatId: existingChat?.id };
        }
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        let meetingLink = appointment.meetingLink;
        if (!meetingLink) {
            meetingLink = await this.googleMeetService.createMeetSpace();
        }
        const updatedAppointment = await this.appointmentRepository.update(appointmentId, {
            status: client_1.AppointmentStatus.IN_PROGRESS,
            startedAt: now,
            endedAt: oneHourLater,
            meetingLink: meetingLink,
        });
        let chatId;
        if (appointment.specialistId) {
            try {
                const existingChat = await this.prisma.chat.findFirst({
                    where: {
                        OR: [
                            { participant1Id: appointment.specialistId, participant2Id: appointment.userId },
                            { participant1Id: appointment.userId, participant2Id: appointment.specialistId },
                        ],
                    },
                });
                if (existingChat) {
                    chatId = existingChat.id;
                    this.logger.log(`Reusing existing chat ${chatId} for appointment ${appointmentId}`);
                }
                else {
                    const newChat = await this.prisma.chat.create({
                        data: {
                            participant1Id: appointment.specialistId,
                            participant2Id: appointment.userId,
                        },
                    });
                    chatId = newChat.id;
                    this.logger.log(`Created chat ${chatId} for appointment ${appointmentId}`);
                }
            }
            catch (chatError) {
                this.logger.error(`Failed to create chat for appointment ${appointmentId}`, chatError);
            }
        }
        this.logger.log(`Session started for appointment ${appointmentId}. Ends at ${oneHourLater}`);
        if (appointment.user?.email && appointment.specialist?.email) {
            await this.mailService.sendSessionStartEndEmail(appointment.user.email, `${appointment.specialist.firstName} ${appointment.specialist.lastName}`, 'STARTED', appointment);
            await this.mailService.sendSessionStartEndEmail(appointment.specialist.email, `${appointment.user.firstName} ${appointment.user.lastName}`, 'STARTED', appointment);
        }
        await this.adminNotificationService.notify('APPOINTMENT', 'Clinical Session Started', `<p>A consultation session has started.</p>
       <p><strong>Appointment ID:</strong> ${appointmentId}</p>
       <p><strong>Participants:</strong> ${appointment.user?.firstName} ${appointment.user?.lastName} & ${appointment.specialist?.firstName} ${appointment.specialist?.lastName}</p>`, false);
        return { ...updatedAppointment, chatId };
    }
    async endSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (userId !== 'SYSTEM') {
            if (appointment.userId !== userId && appointment.specialistId !== userId) {
                throw new common_1.ForbiddenException('You are not a participant in this appointment');
            }
        }
        if (appointment.status !== client_1.AppointmentStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Session is not in progress');
        }
        const now = new Date();
        const updatedAppointment = await this.appointmentRepository.update(appointmentId, {
            status: client_1.AppointmentStatus.COMPLETED,
            endedAt: now,
        });
        await this.finalizeAppointment(appointmentId);
        if (appointment.user?.email && appointment.specialist?.email) {
            await this.mailService.sendSessionStartEndEmail(appointment.user.email, `${appointment.specialist.firstName} ${appointment.specialist.lastName}`, 'ENDED', appointment);
            await this.mailService.sendSessionStartEndEmail(appointment.specialist.email, `${appointment.user.firstName} ${appointment.user.lastName}`, 'ENDED', appointment);
        }
        await this.adminNotificationService.notify('APPOINTMENT', 'Clinical Session Ended', `<p>A consultation session has ended.</p>
       <p><strong>Appointment ID:</strong> ${appointmentId}</p>
       <p><strong>Status:</strong> ${updatedAppointment.status}</p>`, false);
        this.logger.log(`Session ended for appointment ${appointmentId} by user ${userId}.`);
        return updatedAppointment;
    }
    async requestEndSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (appointment.status !== client_1.AppointmentStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Session is not in progress');
        }
        if (appointment.userId !== userId && appointment.specialistId !== userId) {
            throw new common_1.ForbiddenException('You are not a participant in this appointment');
        }
        if (appointment.endRequestedBy) {
            throw new common_1.BadRequestException('End session request already pending');
        }
        const requesterType = appointment.userId === userId ? 'USER' : 'SPECIALIST';
        const otherPartyId = requesterType === 'USER' ? appointment.specialistId : appointment.userId;
        if (otherPartyId) {
            const title = 'End Session Request';
            const message = `${requesterType === 'USER' ? 'User' : 'Specialist'} has requested to end the session.`;
            if (requesterType === 'USER') {
                await this.notificationService.createNotification({
                    specialistId: otherPartyId,
                    title,
                    message
                });
            }
            else {
                await this.notificationService.createNotification({
                    userId: otherPartyId,
                    title,
                    message
                });
            }
            this.appGateway.sendToUser(otherPartyId, 'endSessionRequest', {
                appointmentId,
                requestedBy: requesterType
            });
        }
        return this.appointmentRepository.update(appointmentId, {
            endRequestedBy: requesterType,
            endRequestedAt: new Date(),
        });
    }
    async approveEndSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (!appointment.endRequestedBy) {
            throw new common_1.BadRequestException('No pending end session request');
        }
        const isRequesterUser = appointment.endRequestedBy === 'USER';
        const expectedApproverId = isRequesterUser ? appointment.specialistId : appointment.userId;
        if (userId !== expectedApproverId) {
            throw new common_1.ForbiddenException('You are not authorized to approve this request');
        }
        return this.endSession(appointmentId, userId);
    }
    async declineEndSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (!appointment.endRequestedBy) {
            throw new common_1.BadRequestException('No pending end session request');
        }
        const isRequesterUser = appointment.endRequestedBy === 'USER';
        const expectedDeclinerId = isRequesterUser ? appointment.specialistId : appointment.userId;
        if (userId !== expectedDeclinerId) {
            throw new common_1.ForbiddenException('You are not authorized to decline this request');
        }
        const requesterId = isRequesterUser ? appointment.userId : appointment.specialistId;
        if (requesterId) {
            const title = 'End Session Declined';
            const message = 'The other party declined to end the session.';
            if (isRequesterUser) {
                await this.notificationService.createNotification({ userId: requesterId, title, message });
            }
            else {
                await this.notificationService.createNotification({ specialistId: requesterId, title, message });
            }
            this.appGateway.sendToUser(requesterId, 'endSessionDeclined', { appointmentId });
        }
        return this.appointmentRepository.update(appointmentId, {
            endRequestedBy: null,
            endRequestedAt: null
        });
    }
    async extendSession(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (appointment.specialistId !== userId) {
            throw new common_1.ForbiddenException('Only the specialist can extend the session');
        }
        return this.appointmentRepository.update(appointmentId, {
            isExtended: true,
        });
    }
    async calculateSpecialistPayout(plan, specialistType, userId, specialistId) {
        const sessions = (plan.appointmentLimit && plan.appointmentLimit > 0) ? plan.appointmentLimit : 1;
        const pricePerSession = plan.price / sessions;
        let commissionRate = 0;
        switch (specialistType) {
            case client_1.SpecialistType.SKINCARE_CONSULTANT:
                commissionRate = 0.18;
                break;
            case client_1.SpecialistType.REGISTERED_NURSE:
                commissionRate = 0.23;
                break;
            case client_1.SpecialistType.MEDICAL_OFFICER:
            case client_1.SpecialistType.DERMATOLOGIST:
                commissionRate = 0.28;
                break;
            default:
                commissionRate = 0.18;
                break;
        }
        const payout = Math.round(pricePerSession * commissionRate);
        const previousCompleted = await this.prisma.appointment.findFirst({
            where: {
                userId: userId,
                specialistId: specialistId,
                status: client_1.AppointmentStatus.COMPLETED,
            }
        });
        let finalPayout = payout;
        if (previousCompleted) {
            this.logger.log(`Continuous appointment detected for User ${userId} and Specialist ${specialistId}. Deducting 2% from first payout amount.`);
            finalPayout = Math.round(payout * 0.98);
        }
        this.logger.log(`Payout calc: price=${plan.price}, sessions=${sessions}, pricePerSession=${pricePerSession}, rate=${(commissionRate * 100).toFixed(2)}%, basePayout=${payout}, finalPayout=${finalPayout}`);
        return finalPayout;
    }
    async revertSpecialistPayout(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { specialist: true },
        });
        if (!appointment || !appointment.specialistId) {
            throw new common_1.NotFoundException('Appointment or assigned specialist not found');
        }
        const specialistTransactions = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(appointmentId, client_1.WalletRelatedEntityType.APPOINTMENT);
        const specialistCreditTx = specialistTransactions.find(tx => tx.type === client_1.WalletTransactionType.CREDIT);
        if (!specialistCreditTx) {
            throw new common_1.BadRequestException('No specialist payout found for this appointment');
        }
        const amount = specialistCreditTx.amount;
        const specialistWallet = await this.walletService.getWalletByOwner(appointment.specialistId, client_1.WalletOwnerType.SPECIALIST);
        await this.walletService.debitWallet(specialistWallet.id, amount);
        await this.walletTransactionService.createWalletTransaction({
            walletId: specialistWallet.id,
            type: client_1.WalletTransactionType.DEBIT,
            amount: amount,
            description: `Reversal of payout for Appointment #${appointmentId}`,
            relatedEntityId: appointmentId,
            relatedEntityType: client_1.WalletRelatedEntityType.APPOINTMENT,
        });
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        if (superAdmins.length > 0) {
            const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
            const organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, client_1.WalletOwnerType.ORGANIZATION);
            await this.walletService.creditWallet(organizationWallet.id, amount);
            await this.walletTransactionService.createWalletTransaction({
                walletId: organizationWallet.id,
                type: client_1.WalletTransactionType.CREDIT,
                amount: amount,
                description: `Reversal of payout to Specialist ${appointment.specialistId} for Appointment #${appointmentId}`,
                relatedEntityId: appointmentId,
                relatedEntityType: client_1.WalletRelatedEntityType.APPOINTMENT,
            });
        }
        this.logger.log(`Payout of ${amount} reverted for appointment ${appointmentId}`);
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = AppointmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAppointmentRepository')),
    __param(1, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object, Object, subscription_service_1.SubscriptionService,
        subscription_validation_service_1.SubscriptionValidationService,
        app_gateway_1.AppGateway,
        notification_service_1.NotificationService,
        admin_service_1.AdminService,
        specialist_service_1.SpecialistService,
        specialist_assignment_service_1.SpecialistAssignmentService,
        prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        wallet_transaction_service_1.WalletTransactionService,
        mail_service_1.MailService,
        admin_notification_service_1.AdminNotificationService,
        google_meet_service_1.GoogleMeetService])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map