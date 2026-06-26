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
var SpecialistAssignmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const specialist_assignment_entity_1 = require("../entities/specialist-assignment.entity");
const specialist_service_1 = require("./specialist.service");
const notification_service_1 = require("./notification.service");
const subscription_service_1 = require("./subscription.service");
const app_gateway_1 = require("../../shared/websockets/app.gateway");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const client_1 = require("@prisma/client");
const wallet_service_1 = require("./wallet.service");
const wallet_transaction_service_1 = require("./wallet-transaction.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let SpecialistAssignmentService = SpecialistAssignmentService_1 = class SpecialistAssignmentService {
    constructor(assignmentRepository, specialistService, notificationService, subscriptionService, appGateway, prisma, walletService, walletTransactionService, mailService) {
        this.assignmentRepository = assignmentRepository;
        this.specialistService = specialistService;
        this.notificationService = notificationService;
        this.subscriptionService = subscriptionService;
        this.appGateway = appGateway;
        this.prisma = prisma;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.mailService = mailService;
        this.logger = new common_1.Logger(SpecialistAssignmentService_1.name);
    }
    async assignSpecialists(appointmentId, specialistIds, adminId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { user: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status !== client_1.AppointmentStatus.PENDING) {
            throw new common_1.BadRequestException('Can only assign specialists to pending appointments');
        }
        const specialists = await Promise.all(specialistIds.map(async (id) => {
            const { specialist } = await this.specialistService.findById(id);
            return specialist;
        }));
        specialists.forEach((specialist, index) => {
            if (!specialist) {
                throw new common_1.NotFoundException(`Specialist ${specialistIds[index]} not found`);
            }
        });
        const assignments = [];
        for (const specialistId of specialistIds) {
            const existing = await this.prisma.specialistAssignment.findUnique({
                where: {
                    appointmentId_specialistId: {
                        appointmentId,
                        specialistId,
                    },
                },
            });
            if (!existing) {
                const assignment = await this.assignmentRepository.create({
                    appointmentId,
                    specialistId,
                    assignedBy: adminId,
                    status: specialist_assignment_entity_1.SpecialistAssignmentStatus.PENDING,
                });
                assignments.push(assignment);
                const specialist = specialists.find(s => s.id === specialistId);
                await this.notifySpecialistAssignment(appointment, specialist);
            }
        }
        if (assignments.length > 0) {
            await this.notifyUserAssignment(appointment);
        }
        this.logger.log(`Assigned ${assignments.length} specialists to appointment ${appointmentId}`);
        return assignments;
    }
    async broadcastAppointmentToSpecialists(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { user: true },
        });
        if (!appointment) {
            this.logger.error(`Appointment ${appointmentId} not found during broadcast.`);
            return;
        }
        const admin = await this.prisma.admin.findFirst({
            where: { type: 'SUPER_ADMIN', isActive: true },
        });
        if (!admin) {
            this.logger.error('No active SUPER_ADMIN found to broadcast appointment.');
            return;
        }
        const whereClause = {
            status: 'APPROVED',
            isActive: true,
        };
        if (appointment.specialty === client_1.SpecialtyTier.CONSULTANT) {
            whereClause.type = { not: client_1.SpecialistType.DERMATOLOGIST };
        }
        else {
            whereClause.type = appointment.specialty;
        }
        const specialists = await this.prisma.specialist.findMany({
            where: whereClause,
        });
        if (specialists.length === 0) {
            this.logger.warn(`No active specialists found for broadcast of appointment ${appointmentId} with specialty ${appointment.specialty}`);
            return;
        }
        for (const specialist of specialists) {
            const existing = await this.prisma.specialistAssignment.findUnique({
                where: {
                    appointmentId_specialistId: {
                        appointmentId,
                        specialistId: specialist.id,
                    },
                },
            });
            if (!existing) {
                await this.assignmentRepository.create({
                    appointmentId,
                    specialistId: specialist.id,
                    assignedBy: admin.id,
                    status: specialist_assignment_entity_1.SpecialistAssignmentStatus.PENDING,
                });
                await this.notifySpecialistAssignment(appointment, specialist);
            }
        }
        await this.notifyUserAssignment(appointment);
        this.logger.log(`Broadcasted appointment ${appointmentId} to ${specialists.length} specialists of type ${appointment.specialty}.`);
    }
    async acceptAssignment(assignmentId, specialistId) {
        const assignment = await this.assignmentRepository.findById(assignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        if (assignment.specialistId !== specialistId) {
            throw new common_1.ForbiddenException('You can only accept your own assignments');
        }
        if (assignment.status !== specialist_assignment_entity_1.SpecialistAssignmentStatus.PENDING) {
            throw new common_1.BadRequestException('Assignment has already been responded to');
        }
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: assignment.appointmentId },
            include: { user: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status !== client_1.AppointmentStatus.PENDING) {
            throw new common_1.BadRequestException('This appointment has already been accepted by another specialist');
        }
        const updatedAssignment = await this.assignmentRepository.update(assignmentId, {
            status: specialist_assignment_entity_1.SpecialistAssignmentStatus.ACCEPTED,
            respondedAt: new Date(),
        });
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id: assignment.appointmentId },
            data: {
                specialistId,
                status: client_1.AppointmentStatus.CONFIRMED,
            },
        });
        const cancelledCount = await this.assignmentRepository.cancelOtherAssignments(assignment.appointmentId, assignmentId);
        const { specialist } = await this.specialistService.findById(specialistId);
        await this.notifyUserSpecialistAccepted(appointment, specialist);
        if (appointment.user && appointment.user.email && specialist) {
            await this.mailService.sendAppointmentAcceptedEmail(appointment.user.email, specialist.lastName || specialist.firstName, appointment);
            await this.mailService.sendSpecialistAppointmentAcceptedEmail(specialist.email, `${appointment.user.firstName} ${appointment.user.lastName}`, appointment);
        }
        if (assignment.assignedBy) {
            await this.notifyAdminSpecialistAccepted(appointment, specialist, assignment.assignedBy);
        }
        if (cancelledCount > 0) {
            await this.notifyOtherSpecialistsCancelled(assignment.appointmentId, specialistId);
        }
        this.logger.log(`Specialist ${specialistId} accepted assignment ${assignmentId}`);
        return {
            assignment: updatedAssignment,
            appointment: updatedAppointment,
            cancelledAssignments: cancelledCount,
        };
    }
    async declineAssignment(assignmentId, specialistId) {
        const assignment = await this.assignmentRepository.findById(assignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        if (assignment.specialistId !== specialistId) {
            throw new common_1.ForbiddenException('You can only decline your own assignments');
        }
        if (assignment.status !== specialist_assignment_entity_1.SpecialistAssignmentStatus.PENDING) {
            throw new common_1.BadRequestException('Assignment has already been responded to');
        }
        const updated = await this.assignmentRepository.update(assignmentId, {
            status: specialist_assignment_entity_1.SpecialistAssignmentStatus.DECLINED,
            respondedAt: new Date(),
        });
        this.logger.log(`Specialist ${specialistId} declined assignment ${assignmentId}`);
        return updated;
    }
    async getSpecialistAssignments(specialistId, status) {
        return this.assignmentRepository.findBySpecialistId(specialistId, status);
    }
    async findAllAssignments() {
        return this.assignmentRepository.findAll();
    }
    async getAssignmentsForAppointment(appointmentId) {
        return this.assignmentRepository.findByAppointmentId(appointmentId);
    }
    async notifySpecialistAssignment(appointment, specialist) {
        const title = 'New Appointment Assignment';
        const message = `You have been assigned to a ${appointment.specialty} appointment. Please review and accept or decline.`;
        await this.notificationService.createNotification({
            specialistId: specialist.id,
            title,
            message,
        });
        this.appGateway.sendToUser(specialist.id, 'newNotification', {
            title,
            message,
            appointmentId: appointment.id,
            type: 'specialistAssignment',
        });
    }
    async notifyUserAssignment(appointment) {
        const title = 'Specialist Assignment in Progress';
        const message = 'We are finding the best specialist for your appointment. You will be notified once confirmed.';
        await this.notificationService.createNotification({
            userId: appointment.userId,
            title,
            message,
        });
        this.appGateway.sendToUser(appointment.userId, 'newNotification', {
            title,
            message,
            appointmentId: appointment.id,
            type: 'specialistAssignmentProgress',
        });
    }
    async notifyUserSpecialistAccepted(appointment, specialist) {
        const title = 'Specialist Confirmed!';
        const message = `Dr. ${specialist.firstName} ${specialist.lastName} has accepted your ${appointment.specialty} appointment.`;
        await this.notificationService.createNotification({
            userId: appointment.userId,
            title,
            message,
        });
        this.appGateway.sendToUser(appointment.userId, 'newNotification', {
            title,
            message,
            appointmentId: appointment.id,
            specialistId: specialist.id,
            specialistName: `${specialist.firstName} ${specialist.lastName}`,
            type: 'specialistAccepted',
        });
    }
    async notifyOtherSpecialistsCancelled(appointmentId, acceptedSpecialistId) {
        const cancelledAssignments = await this.assignmentRepository.findByAppointmentId(appointmentId);
        for (const assignment of cancelledAssignments) {
            if (assignment.specialistId !== acceptedSpecialistId && assignment.status === specialist_assignment_entity_1.SpecialistAssignmentStatus.CANCELLED) {
                const title = 'Appointment Filled';
                const message = 'This appointment has been accepted by another specialist.';
                await this.notificationService.createNotification({
                    specialistId: assignment.specialistId,
                    title,
                    message,
                });
                this.appGateway.sendToUser(assignment.specialistId, 'newNotification', {
                    title,
                    message,
                    appointmentId,
                    type: 'appointmentFilled',
                });
            }
        }
    }
    async notifyAdminSpecialistAccepted(appointment, specialist, adminId) {
        const title = 'Appointment Accepted by Specialist';
        const message = `Dr. ${specialist.firstName} ${specialist.lastName} has accepted the ${appointment.specialety} appointment for user ${appointment.user.firstName} ${appointment.user.lastName}.`;
        await this.notificationService.createNotification({
            adminId: adminId,
            title,
            message,
        });
        this.appGateway.sendToUser(adminId, 'newNotification', {
            title,
            message,
            appointmentId: appointment.id,
            specialistId: specialist.id,
            specialistName: `${specialist.firstName} ${specialist.lastName}`,
            userId: appointment.userId,
            userName: `${appointment.user.firstName} ${appointment.user.lastName}`,
            type: 'adminSpecialistAccepted',
        });
    }
};
exports.SpecialistAssignmentService = SpecialistAssignmentService;
exports.SpecialistAssignmentService = SpecialistAssignmentService = SpecialistAssignmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ISpecialistAssignmentRepository')),
    __metadata("design:paramtypes", [Object, specialist_service_1.SpecialistService,
        notification_service_1.NotificationService,
        subscription_service_1.SubscriptionService,
        app_gateway_1.AppGateway,
        prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        wallet_transaction_service_1.WalletTransactionService,
        mail_service_1.MailService])
], SpecialistAssignmentService);
//# sourceMappingURL=specialist-assignment.service.js.map