import { Injectable, Inject, NotFoundException, InternalServerErrorException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import { Appointment } from '../entities/appointment.entity';
import type * as Repositories from '../repositories/appointment.repository.interface';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { SpecialistType, SpecialtyTier, AppointmentStatus, PaymentGateway, TransactionStatus, AdminType, WalletOwnerType, WalletTransactionType, WalletRelatedEntityType } from '@prisma/client';
import { CreateAppointmentParams, UpdateAppointmentParams } from 'src/utils/type';
import { SubscriptionService } from './subscription.service';
import { SubscriptionStatus } from '../entities/subscription.entity';
import { UserSubscriptionWithPlan } from '../types/subscription.types';
import { AppGateway } from 'src/shared/websockets/app.gateway';
import { NotificationService } from './notification.service';
import { AdminService } from './admin.service';
import { SpecialistService } from './specialist.service';
import { SpecialistAssignmentService } from './specialist-assignment.service';
import { SubscriptionValidationService } from './subscription-validation.service';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { WalletService } from './wallet.service';
import { WalletTransactionService } from './wallet-transaction.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { AdminNotificationService } from './admin-notification.service';
import { GoogleMeetService } from './google-meet.service';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: Repositories.IAppointmentRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionValidationService: SubscriptionValidationService,
    private readonly appGateway: AppGateway,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
    private readonly specialistService: SpecialistService,
    private readonly specialistAssignmentService: SpecialistAssignmentService,
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly walletTransactionService: WalletTransactionService,
    private readonly mailService: MailService,
    private readonly adminNotificationService: AdminNotificationService,
    private readonly googleMeetService: GoogleMeetService,
  ) {}

  async createAppointment(params: CreateAppointmentParams): Promise<any> {
    // 1. Validate subscription eligibility
    const eligibility = await this.subscriptionValidationService.validateSubscriptionForAppointment(params.userId);
    
    if (!eligibility.eligible) {
      throw new BadRequestException(eligibility.reason);
    }

    const userSubscription = eligibility.subscription!;
    const plan = userSubscription.pricingPlan;

    // 🛡️ RE-ENFORCED: Session deduction is now handled during Specialist Acceptance
    // (SpecialistAssignmentService.acceptAssignment)
    
    // 4. Create the Appointment Entry
    const appointmentEntity = new Appointment({
      id: '',
      userId: params.userId,
      subscriptionId: userSubscription.id,
      specialty: params.specialty as SpecialtyTier,
      type: plan.type,
      status: AppointmentStatus.PENDING,
      price: plan.price,
      scheduledAt: params.scheduledAt,
      notes: params.notes,
      specialistId: params.specialistId,
      organizationId: params.organizationId,
    });

    const newAppointment = await this.appointmentRepository.create(appointmentEntity);

    // Get User details for email
    const user = await this.prisma.user.findUnique({ where: { id: params.userId } });

    // 5. Create a Pending Transaction
    try {
      const transaction = await this.transactionRepository.create({
        userId: params.userId,
        appointmentId: newAppointment.id,
        amount: plan.price,
        status: TransactionStatus.PENDING,
        gateway: PaymentGateway.PAYSTACK,
      });

      // Email Notification to User
      if (user && user.email) {
        await this.mailService.sendAppointmentCreatedEmail(user.email, newAppointment);
      }

      // 6. Notify OPERATIONS_ADMIN about new PENDING appointment
      await this.notifyOperationsAdmins(newAppointment);
      this.logger.log(`Operations admins notified for new PENDING appointment ${newAppointment.id}`);

      // 🛡️ Routing Logic: Dermatologists are manual assigned. Others are broadcasted.
      if (params.specialty === SpecialtyTier.DERMATOLOGIST) {
        this.logger.log(`Appointment ${newAppointment.id} is for a DERMATOLOGIST. Routing to Admins only. Skipped broadcast.`);
      } else {
        // Broadcast to all specialists as well (Automatic Claim logic)
        try {
          if (!params.organizationId) {
            await this.specialistAssignmentService.broadcastAppointmentToSpecialists(newAppointment.id);
          } else {
            this.logger.log(`B2B Appointment created: ${newAppointment.id}. Waiting for Facility Admin assignment. Skipped broadcast.`);
            // Notifying facility admins can be handled here or in a separate flow.
          }
        } catch (broadcastError) {
          this.logger.error(`Broadcast failed for appointment ${newAppointment.id}`, broadcastError);
        }
      }

      // 7. Return both so the Frontend knows where to redirect for payment
      return {
        ...newAppointment,
        transactionId: transaction.id,
        checkoutUrl: `/api/transactions/pay/${transaction.id}`
      };
    } catch (error) {
      this.logger.error('Failed to initialize transaction for appointment', error);
      throw new InternalServerErrorException('Could not initialize payment gateway');
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByUserId(userId);
  }

  async getSpecialistAppointments(specialistId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findBySpecialistId(specialistId, [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.IN_PROGRESS,
    ]);
  }

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const updateParams: UpdateAppointmentParams = { status: status as any };
    const updatedAppointment = await this.appointmentRepository.update(id, updateParams);

    // If appointment status changed to CONFIRMED, send notifications
    if (updatedAppointment.status === AppointmentStatus.CONFIRMED) {
      this.logger.log(`Appointment ${id} status changed to CONFIRMED. Sending notifications.`);

      // 1. Notify Operations Admin
      await this.notifyOperationsAdmins(updatedAppointment, 'Appointment Confirmed!', `Appointment ID: ${updatedAppointment.id} has been confirmed and scheduled.`);

      // 2. Notify Specialist if assigned
      if (updatedAppointment.specialistId) {
        const { specialist } = await this.specialistService.findById(updatedAppointment.specialistId); // Destructured
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

  async scheduleAppointment(
    id: string,
    scheduledAt: Date,
    notes?: string,
    specialistId?: string, // Allow specialistId to be updated when scheduling
  ): Promise<Appointment> {
    const updateParams: UpdateAppointmentParams = {
      scheduledAt,
      notes,
      status: AppointmentStatus.CONFIRMED,
      specialistId,
    };
    const updatedAppointment = await this.appointmentRepository.update(id, updateParams);

    // This method implicitly confirms and schedules, so notifications logic can be reused from updateAppointmentStatus
    // or placed directly here if updateAppointmentStatus is not expected to be called with CONFIRMED status elsewhere.
    // For now, let's keep it here for clarity regarding *scheduling* action.

    this.logger.log(`Appointment ${id} scheduled and confirmed. Sending notifications.`);

    // 1. Notify Operations Admin
    await this.notifyOperationsAdmins(updatedAppointment, 'Appointment Scheduled!', `Appointment ID: ${updatedAppointment.id} has been scheduled for ${scheduledAt}.`);

    // 2. Notify Specialist if assigned
    if (updatedAppointment.specialistId) {
      const { specialist } = await this.specialistService.findById(updatedAppointment.specialistId); // Destructured
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

  // 🛡️ Webhook handler for payment confirmation
  async confirmPaymentAndActivate(appointmentId: string, transactionId: string): Promise<void> {
    await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.CONFIRMED
    });
    // The notifications for CONFIRMED status are now handled in updateAppointmentStatus or scheduleAppointment
  }

  // Helper method to notify operations admins
  private async notifyOperationsAdmins(
    appointment: Appointment,
    title: string = 'New Appointment Request',
    message?: string
  ): Promise<void> {
    const admins = await this.adminService.findAllAdmin();
    const operationsAdmins = admins.filter(
      admin => admin.isActive && (admin.type === AdminType.OPERATIONS_ADMIN || admin.type === AdminType.SUPER_ADMIN)
    );

    const defaultMessage = message || `User ${appointment.userId} has booked a new appointment with ID: ${appointment.id}. Please assign a specialist.`;

    // 📧 Notify Relevant Admins (Super, Operations, Medical Reviewer)
    // 🛡️ RE-ENFORCED: Email notification to admins is now disabled per user request to reduce noise. 
    // Database notifications remain active for dashboard tracking.
    await this.adminNotificationService.notify(
      'APPOINTMENT',
      title,
      `<p>${defaultMessage}</p>
       <p><strong>Appointment ID:</strong> ${appointment.id}</p>
       <p><strong>Specialty:</strong> ${appointment.specialty}</p>
       <p><strong>Scheduled At:</strong> ${appointment.scheduledAt}</p>`,
      false // sendEmail = false
    );

    for (const admin of operationsAdmins) {
      await this.notificationService.createNotification({
        adminId: admin.id,
        title,
        message: defaultMessage,
      });
      // ... same websocket code ...
      this.appGateway.sendToUser(admin.id, 'newNotification', {
        title,
        message: defaultMessage,
        appointmentId: appointment.id,
        type: 'newAppointmentAdmin'
      });
    }
  }

  async completeAppointment(appointmentId: string, userId: string, isSpecialist: boolean = false): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true, specialist: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed appointments can be completed');
    }

    // Verify user is either the appointment owner, the assigned specialist, or the SYSTEM background service
    if (userId !== 'SYSTEM') {
      if (!isSpecialist && appointment.userId !== userId) {
        throw new ForbiddenException('You can only complete your own appointments');
      }

      if (isSpecialist && appointment.specialistId !== userId) {
        throw new ForbiddenException('You can only complete appointments assigned to you');
      }
    }

    // Update appointment status
    const updated = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.COMPLETED,
    });

    // Run business logic for completion (payout, deduction, notifications)
    await this.finalizeAppointment(appointmentId);

    return updated;
  }

  /**
   * 🛡️ CORE BUSINESS LOGIC for finalizing an appointment.
   * Handles specialist payout, session deduction, and notifications.
   * Should be called AFTER status is updated to COMPLETED.
   */
  private async finalizeAppointment(appointmentId: string): Promise<void> {
    const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { user: true, specialist: true },
      });
  
      if (!appointment) return;

    // 🛡️ RE-ENFORCED: Deduct sessions and Calculate Payout
    let pricingPlan: any = null;
    if (appointment.subscriptionId) {
        try {
            const subWithPlan = await this.subscriptionService.getSubscriptionById(appointment.subscriptionId);
            const plan = subWithPlan.pricingPlan;
            pricingPlan = plan; // Store for payout calculation

            if (plan.isInstantSession) {
                await this.subscriptionService.endInstantSession(appointment.subscriptionId);
                this.logger.log(`Instant session ${appointment.subscriptionId} ended upon completion.`);
            } else if (plan.appointmentLimit !== null && plan.appointmentLimit > 0) {
                if (subWithPlan.remainingSessions !== null && subWithPlan.remainingSessions > 0) {
                    await this.subscriptionService.decrementRemainingSessions(appointment.subscriptionId);
                    this.logger.log(`Session decremented for subscription ${appointment.subscriptionId} upon completion.`);
                } else {
                    this.logger.warn(`Subscription ${appointment.subscriptionId} has no remaining sessions to deduct at completion.`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to deduct sessions for subscription ${appointment.subscriptionId}`, error);
            // We don't throw here to avoid failing the completion if only deduction fails
        }
    }

    // Increment specialist's completed appointments count and Process Payment
    if (appointment.specialistId) {
      await this.prisma.specialist.update({
        where: { id: appointment.specialistId },
        data: { completedAppointments: { increment: 1 } },
      });
      this.logger.log(`Incremented completed appointments for specialist ${appointment.specialistId}`);

      // 💰 CREDIT SPECIALIST WALLET (10% Commission or custom logic)
      if (appointment.price && appointment.price > 0) {
        // 🛡️ IDEMPOTENCY CHECK: Ensure we haven't already paid out for this appointment
        const existingTransactions = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(
            appointment.id,
            WalletRelatedEntityType.APPOINTMENT
        );

        let isAlreadyPaidOut = false;
        if (existingTransactions && existingTransactions.length > 0) {
            // Check if there's already a CREDIT to a specialist wallet for this appointment
            const payoutTx = existingTransactions.find(tx => tx.type === WalletTransactionType.CREDIT);
            if (payoutTx) {
                isAlreadyPaidOut = true;
                this.logger.log(`Appointment ${appointment.id} already paid out. Skipping duplicate payout...`);
            }
        }

        if (!isAlreadyPaidOut) {
            let commissionAmount = 0;

            // 🧮 CALCULATE PAYOUT
            if (pricingPlan && appointment.specialist.type) {
                commissionAmount = await this.calculateSpecialistPayout(
                    pricingPlan, 
                    appointment.specialist.type, 
                    appointment.userId, 
                    appointment.specialistId
                );
                this.logger.log(`Calculated dynamic payout: ${commissionAmount} for plan price ${pricingPlan.price} and type ${appointment.specialist.type}`);
            } else {
                // Fallback to 10% if no plan context (e.g. direct booking without explicit plan link?)
                commissionAmount = appointment.price * 0.1; 
                this.logger.warn(`Using fallback 10% commission: ${commissionAmount}. Plan or Type missing.`);
            }
            // 1. Get the Organization Wallet (for payout record)
            const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
            if (superAdmins.length === 0) {
                this.logger.error('No SUPER_ADMIN found to link Organization Wallet for specialist payout debit.');
            } else {
                const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
                let organizationWallet: any;
                try {
                  organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, WalletOwnerType.ORGANIZATION);
                } catch (error) {
                  if (error instanceof NotFoundException) {
                    organizationWallet = await this.walletService.createWallet({
                      ownerId: ORGANIZATION_ADMIN_ID,
                      ownerType: WalletOwnerType.ORGANIZATION,
                      initialBalance: 0,
                    });
                    this.logger.log(`Created Organization Wallet during specialist payout: ${organizationWallet.id}`);
                  } else {
                    this.logger.error(`Error retrieving Org wallet for specialist payout: ${error.message}`);
                  }
                }

                if (organizationWallet) {
                    await this.walletService.debitWallet(organizationWallet.id, commissionAmount);
                    await this.walletTransactionService.createWalletTransaction({
                        walletId: organizationWallet.id,
                        type: WalletTransactionType.DEBIT,
                        amount: commissionAmount,
                        description: `Payout to Specialist ${appointment.specialistId} for Appointment #${appointment.id}`,
                        relatedEntityId: appointment.id,
                        relatedEntityType: WalletRelatedEntityType.APPOINTMENT,
                    });
                    this.logger.log(`Organization wallet ${organizationWallet.id} debited ${commissionAmount} for specialist payout.`);
                }
            }

            // 2. Credit Specialist Wallet
            let specialistWallet: any;
            try {
              specialistWallet = await this.walletService.getWalletByOwner(appointment.specialistId, WalletOwnerType.SPECIALIST);
            } catch (error) {
              if (error instanceof NotFoundException) {
                specialistWallet = await this.walletService.createWallet({
                  ownerId: appointment.specialistId,
                  ownerType: WalletOwnerType.SPECIALIST,
                  initialBalance: 0,
                });
                this.logger.log(`Created Specialist Wallet during payout: ${specialistWallet.id} for specialist ${appointment.specialistId}`);
              } else {
                throw error;
              }
            }

            await this.walletService.creditWallet(specialistWallet.id, commissionAmount);
            await this.walletTransactionService.createWalletTransaction({
                walletId: specialistWallet.id,
                type: WalletTransactionType.CREDIT,
                amount: commissionAmount,
                description: `Payout for Appointment #${appointment.id}`,
                relatedEntityId: appointment.id,
                relatedEntityType: WalletRelatedEntityType.APPOINTMENT,
            });
            this.logger.log(`Credited specialist ${appointment.specialistId} with ${commissionAmount} for appointment ${appointment.id}`);
        }
      }
    }

    // Notify both parties
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

  async cancelAppointment(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }
    const updated = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    });
    return updated;
  }

  /**
   * Find an active (CONFIRMED or IN_PROGRESS) appointment between two users.
   * Handles both user-specialist and specialist-user directions.
   */
  async getActiveAppointmentBetween(requesterId: string, otherUserId: string): Promise<any> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        AND: [
          { status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS] } },
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
      throw new NotFoundException('No active appointment found between these participants.');
    }

    return appointment;
  }

  /**
   * Generate a Google Meet link for the active appointment between the two parties.
   * Either party (patient or specialist) can initiate this.
   * Broadcasts `meetingLinkCreated` to both participants via WebSocket.
   */
  async createMeetingForParticipants(
    requesterId: string,
    otherUserId: string,
  ): Promise<{ meetLink: string; appointmentId: string }> {
    const appointment = await this.getActiveAppointmentBetween(requesterId, otherUserId);

    // Re-use existing link if already created
    if (appointment.meetingLink) {
      this.logger.log(`Re-using existing Meet link for appointment ${appointment.id}`);
      this.broadcastMeetLink(appointment.id, appointment.meetingLink, appointment.userId, appointment.specialistId);
      return { meetLink: appointment.meetingLink, appointmentId: appointment.id };
    }

    // Generate new Google Meet link
    const meetLink = await this.googleMeetService.createMeetSpace();
    if (!meetLink) {
      throw new InternalServerErrorException('Failed to generate Google Meet link. Check Google Meet service configuration.');
    }

    // Save the link to the appointment
    await this.appointmentRepository.update(appointment.id, { meetingLink: meetLink } as any);
    this.logger.log(`Meet link saved for appointment ${appointment.id}: ${meetLink}`);

    // Broadcast to both parties
    this.broadcastMeetLink(appointment.id, meetLink, appointment.userId, appointment.specialistId);

    return { meetLink, appointmentId: appointment.id };
  }

  private broadcastMeetLink(appointmentId: string, meetLink: string, userId: string, specialistId?: string | null) {
    const payload = { appointmentId, meetLink, type: 'meetingLinkCreated' };
    this.appGateway.sendToUser(userId, 'meetingLinkCreated', payload);
    if (specialistId) {
      this.appGateway.sendToUser(specialistId, 'meetingLinkCreated', payload);
    }
    this.logger.log(`Broadcasted meetingLinkCreated to user ${userId} and specialist ${specialistId}`);
  }

  async getAppointmentById(appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async startSession(appointmentId: string, userId: string): Promise<Appointment & { chatId?: string }> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed appointments can be started');
    }

    // Verify user is either the patient or the specialist
    if (appointment.userId !== userId && appointment.specialistId !== userId) {
      throw new ForbiddenException('You are not a participant in this appointment');
    }

    // If session already started, find the existing chat and return it
    if (appointment.startedAt) {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          OR: [
            { participant1Id: appointment.specialistId!, participant2Id: appointment.userId },
            { participant1Id: appointment.userId, participant2Id: appointment.specialistId! },
          ],
        },
      });
      return { ...appointment, chatId: existingChat?.id };
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Generate Google Meet Link if not already created
    let meetingLink = appointment.meetingLink;
    if (!meetingLink) {
      meetingLink = await this.googleMeetService.createMeetSpace();
    }

    const updatedAppointment = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.IN_PROGRESS,
      startedAt: now,
      endedAt: oneHourLater,
      meetingLink: meetingLink,
    } as any);

    // Create a chat between specialist and patient (using Prisma directly to avoid circular dependency)
    let chatId: string | undefined;
    if (appointment.specialistId) {
      try {
        // Check if chat already exists between these two participants
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
        } else {
          const newChat = await this.prisma.chat.create({
            data: {
              participant1Id: appointment.specialistId,
              participant2Id: appointment.userId,
            },
          });
          chatId = newChat.id;
          this.logger.log(`Created chat ${chatId} for appointment ${appointmentId}`);
        }
      } catch (chatError) {
        this.logger.error(`Failed to create chat for appointment ${appointmentId}`, chatError);
        // Don't fail the session start just because chat creation failed
      }
    }

    this.logger.log(`Session started for appointment ${appointmentId}. Ends at ${oneHourLater}`);

    // Email Notification to both parties
    if (appointment.user?.email && appointment.specialist?.email) {
      // Notify User
      await this.mailService.sendSessionStartEndEmail(
        appointment.user.email,
        `${appointment.specialist.firstName} ${appointment.specialist.lastName}`,
        'STARTED',
        appointment, // Use 'appointment' instead of 'updatedAppointment' for full details
      );
      // Notify Specialist
      await this.mailService.sendSessionStartEndEmail(
        appointment.specialist.email,
        `${appointment.user.firstName} ${appointment.user.lastName}`,
        'STARTED',
        appointment, // Use 'appointment' instead of 'updatedAppointment' for full details
      );
    }

    // 📧 Notify Admins
    // 🛡️ RE-ENFORCED: Email notification to admins is now disabled per user request to reduce noise. 
    await this.adminNotificationService.notify(
      'APPOINTMENT',
      'Clinical Session Started',
      `<p>A consultation session has started.</p>
       <p><strong>Appointment ID:</strong> ${appointmentId}</p>
       <p><strong>Participants:</strong> ${appointment.user?.firstName} ${appointment.user?.lastName} & ${appointment.specialist?.firstName} ${appointment.specialist?.lastName}</p>`,
       false // sendEmail = false
    );

    return { ...updatedAppointment, chatId };
  }

  async endSession(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Verify user is either the patient or the specialist
    if (userId !== 'SYSTEM') {
        if (appointment.userId !== userId && appointment.specialistId !== userId) {
            throw new ForbiddenException('You are not a participant in this appointment');
        }
    }

    // Check if session is in progress
    if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is not in progress');
    }

    const now = new Date();

    const updatedAppointment = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.COMPLETED,
      endedAt: now,
    });

    // Run business logic for completion (payout, deduction, notifications)
    await this.finalizeAppointment(appointmentId);

    // Email Notification to both parties
    if (appointment.user?.email && appointment.specialist?.email) {
      // Notify User
      await this.mailService.sendSessionStartEndEmail(
        appointment.user.email,
        `${appointment.specialist.firstName} ${appointment.specialist.lastName}`,
        'ENDED',
        appointment, // Use 'appointment' instead of 'updatedAppointment' for full details
      );
      // Notify Specialist
      await this.mailService.sendSessionStartEndEmail(
        appointment.specialist.email,
        `${appointment.user.firstName} ${appointment.user.lastName}`,
        'ENDED',
        appointment, // Use 'appointment' instead of 'updatedAppointment' for full details
      );
    }

    // 📧 Notify Admins
    // 🛡️ RE-ENFORCED: Email notification to admins is now disabled per user request. 
    await this.adminNotificationService.notify(
      'APPOINTMENT',
      'Clinical Session Ended',
      `<p>A consultation session has ended.</p>
       <p><strong>Appointment ID:</strong> ${appointmentId}</p>
       <p><strong>Status:</strong> ${updatedAppointment.status}</p>`,
       false // sendEmail = false
    );

    this.logger.log(`Session ended for appointment ${appointmentId} by user ${userId}.`);

    return updatedAppointment;
  }

  async requestEndSession(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is not in progress');
    }

    if (appointment.userId !== userId && appointment.specialistId !== userId) {
      throw new ForbiddenException('You are not a participant in this appointment');
    }

    // Check if request already pending
    if (appointment.endRequestedBy) {
       throw new BadRequestException('End session request already pending');
    }

    const requesterType = appointment.userId === userId ? 'USER' : 'SPECIALIST';
    
    // Notify the other party
    const otherPartyId = requesterType === 'USER' ? appointment.specialistId : appointment.userId;
    if (otherPartyId) {
       const title = 'End Session Request';
       const message = `${requesterType === 'USER' ? 'User' : 'Specialist'} has requested to end the session.`;
       
       // Handle standard notification logic
       if (requesterType === 'USER') {
           // Notify Specialist
           await this.notificationService.createNotification({
               specialistId: otherPartyId,
               title,
               message
           });
       } else {
           // Notify User
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
    } as any);
  }

  async approveEndSession(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (!appointment.endRequestedBy) {
        throw new BadRequestException('No pending end session request');
    }

    // Ensure the approver is the OTHER party
    const isRequesterUser = appointment.endRequestedBy === 'USER';
    const expectedApproverId = isRequesterUser ? appointment.specialistId : appointment.userId;

    if (userId !== expectedApproverId) {
        throw new ForbiddenException('You are not authorized to approve this request');
    }

    // End session logic (re-use endSession for IN_PROGRESS)
    return this.endSession(appointmentId, userId);
  }

  async declineEndSession(appointmentId: string, userId: string): Promise<Appointment> {
      const appointment = await this.appointmentRepository.findById(appointmentId);
      if (!appointment) throw new NotFoundException('Appointment not found');

      if (!appointment.endRequestedBy) {
          throw new BadRequestException('No pending end session request');
      }

      // Ensure the decliner is the OTHER party
      const isRequesterUser = appointment.endRequestedBy === 'USER';
      const expectedDeclinerId = isRequesterUser ? appointment.specialistId : appointment.userId;

      if (userId !== expectedDeclinerId) {
          throw new ForbiddenException('You are not authorized to decline this request');
      }

      // Notify original requester
      const requesterId = isRequesterUser ? appointment.userId : appointment.specialistId;
      if (requesterId) {
          const title = 'End Session Declined';
          const message = 'The other party declined to end the session.';
           if (isRequesterUser) {
               await this.notificationService.createNotification({ userId: requesterId, title, message });
           } else {
               await this.notificationService.createNotification({ specialistId: requesterId, title, message });
           }
           this.appGateway.sendToUser(requesterId, 'endSessionDeclined', { appointmentId });
      }

      return this.appointmentRepository.update(appointmentId, {
          endRequestedBy: null,
          endRequestedAt: null
      } as any);
  }

  async extendSession(appointmentId: string, userId: string): Promise<Appointment> {
      const appointment = await this.appointmentRepository.findById(appointmentId);
      if (!appointment) throw new NotFoundException('Appointment not found');

      // Only Specialist can extend
      if (appointment.specialistId !== userId) {
          throw new ForbiddenException('Only the specialist can extend the session');
      }
      
      return this.appointmentRepository.update(appointmentId, {
          isExtended: true,
          // Optional: Extend endedAt?
          // endedAt: new Date(appointment.endedAt.getTime() + 30 * 60000) 
      } as any);
  }


  // 💰 Helper: Calculate Specialist Payout as % of price-per-session
  private async calculateSpecialistPayout(plan: any, specialistType: SpecialistType, userId: string, specialistId: string): Promise<number> {
    // Price per session = total plan price ÷ number of sessions
    // If appointmentLimit is null or 0 (unlimited), treat as 1 session to avoid division issues
    const sessions = (plan.appointmentLimit && plan.appointmentLimit > 0) ? plan.appointmentLimit : 1;
    const pricePerSession = plan.price / sessions;

    // Commission percentage per specialist type
    let commissionRate = 0;
    switch (specialistType) {
      case SpecialistType.SKINCARE_CONSULTANT:
        commissionRate = 0.18; // 18%
        break;
      case SpecialistType.REGISTERED_NURSE:
        commissionRate = 0.23; // 23%
        break;
      case SpecialistType.MEDICAL_OFFICER:
      case SpecialistType.DERMATOLOGIST:
        commissionRate = 0.28; // 28%
        break;
      default:
        commissionRate = 0.18; // Fallback to lowest rate
        break;
    }

    const payout = Math.round(pricePerSession * commissionRate);

    // 🛡️ RE-ENFORCED: Continuous Appointment Deduction (2% reduction for repeat specialist)
    const previousCompleted = await this.prisma.appointment.findFirst({
        where: {
            userId: userId,
            specialistId: specialistId,
            status: AppointmentStatus.COMPLETED,
        }
    });

    let finalPayout = payout;
    if (previousCompleted) {
        this.logger.log(`Continuous appointment detected for User ${userId} and Specialist ${specialistId}. Deducting 2% from first payout amount.`);
        finalPayout = Math.round(payout * 0.98); // 2% off from the first payout
    }

    this.logger.log(
      `Payout calc: price=${plan.price}, sessions=${sessions}, pricePerSession=${pricePerSession}, rate=${(commissionRate * 100).toFixed(2)}%, basePayout=${payout}, finalPayout=${finalPayout}`
    );
    return finalPayout;
  }

  async revertSpecialistPayout(appointmentId: string): Promise<void> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { specialist: true },
    });

    if (!appointment || !appointment.specialistId) {
      throw new NotFoundException('Appointment or assigned specialist not found');
    }

    // 1. Find the CREDIT transaction to the specialist for this appointment
    const specialistTransactions = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(
      appointmentId,
      WalletRelatedEntityType.APPOINTMENT
    );

    const specialistCreditTx = specialistTransactions.find(
      tx => tx.type === WalletTransactionType.CREDIT
    );

    if (!specialistCreditTx) {
      throw new BadRequestException('No specialist payout found for this appointment');
    }

    // 2. Execute reversal
    const amount = specialistCreditTx.amount;

    // Debit Specialist Wallet
    const specialistWallet = await this.walletService.getWalletByOwner(appointment.specialistId, WalletOwnerType.SPECIALIST);
    await this.walletService.debitWallet(specialistWallet.id, amount);
    await this.walletTransactionService.createWalletTransaction({
      walletId: specialistWallet.id,
      type: WalletTransactionType.DEBIT,
      amount: amount,
      description: `Reversal of payout for Appointment #${appointmentId}`,
      relatedEntityId: appointmentId,
      relatedEntityType: WalletRelatedEntityType.APPOINTMENT,
    });

    // Credit Organization Wallet
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    if (superAdmins.length > 0) {
      const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
      const organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, WalletOwnerType.ORGANIZATION);
      await this.walletService.creditWallet(organizationWallet.id, amount);
      await this.walletTransactionService.createWalletTransaction({
        walletId: organizationWallet.id,
        type: WalletTransactionType.CREDIT,
        amount: amount,
        description: `Reversal of payout to Specialist ${appointment.specialistId} for Appointment #${appointmentId}`,
        relatedEntityId: appointmentId,
        relatedEntityType: WalletRelatedEntityType.APPOINTMENT,
      });
    }

    this.logger.log(`Payout of ${amount} reverted for appointment ${appointmentId}`);
  }
}