import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { ISpecialistAssignmentRepository } from '../repositories/specialist-assignment.repository.interface';
import { SpecialistAssignmentEntity, SpecialistAssignmentStatus } from '../entities/specialist-assignment.entity';
import { SpecialistService } from './specialist.service';
import { NotificationService } from './notification.service';
import { SubscriptionService } from './subscription.service';
import { AppGateway } from 'src/shared/websockets/app.gateway';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AppointmentStatus, WalletOwnerType, WalletTransactionType, WalletRelatedEntityType, SpecialistType, SpecialtyTier } from '@prisma/client';
import { WalletService } from './wallet.service';
import { WalletTransactionService } from './wallet-transaction.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class SpecialistAssignmentService {
  private readonly logger = new Logger(SpecialistAssignmentService.name);

  constructor(
    @Inject('ISpecialistAssignmentRepository')
    private readonly assignmentRepository: ISpecialistAssignmentRepository,
    private readonly specialistService: SpecialistService,
    private readonly notificationService: NotificationService,
    private readonly subscriptionService: SubscriptionService,
    private readonly appGateway: AppGateway,
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly walletTransactionService: WalletTransactionService,
    private readonly mailService: MailService,
  ) {}

  async assignSpecialists(
    appointmentId: string,
    specialistIds: string[],
    adminId: string,
  ): Promise<SpecialistAssignmentEntity[]> {
    // Validate appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Can only assign specialists to pending appointments');
    }

    // Validate all specialists exist and are approved
    const specialists = await Promise.all(
      specialistIds.map(async id => {
        const { specialist } = await this.specialistService.findById(id);
        return specialist;
      })
    );

    specialists.forEach((specialist, index) => {
      if (!specialist) {
        throw new NotFoundException(`Specialist ${specialistIds[index]} not found`);
      }
    });

    // Create assignments
    const assignments: SpecialistAssignmentEntity[] = [];
    for (const specialistId of specialistIds) {
      // Check if already assigned
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
          status: SpecialistAssignmentStatus.PENDING,
        });
        assignments.push(assignment);

        // Notify specialist
        const specialist = specialists.find(s => s.id === specialistId)!;
        await this.notifySpecialistAssignment(appointment, specialist);
      }
    }

    // Notify user
    if (assignments.length > 0) {
      await this.notifyUserAssignment(appointment);
    }

    this.logger.log(`Assigned ${assignments.length} specialists to appointment ${appointmentId}`);
    return assignments;
  }

  async broadcastAppointmentToSpecialists(appointmentId: string): Promise<void> {
    // 1. Get the appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true },
    });

    if (!appointment) {
      this.logger.error(`Appointment ${appointmentId} not found during broadcast.`);
      return;
    }

    // 2. Find a SUPER_ADMIN to act as the "assigner"
    const admin = await this.prisma.admin.findFirst({
      where: { type: 'SUPER_ADMIN', isActive: true },
    });

    if (!admin) {
      this.logger.error('No active SUPER_ADMIN found to broadcast appointment.');
      return;
    }

    // 3. Find all APPROVED and ACTIVE specialists who can attend this appointment
    // 🛡️ RE-ENFORCED: "Consultant" (SpecialtyTier.CONSULTANT) broadcasts to all except DERMATOLOGIST
    const whereClause: any = {
      status: 'APPROVED',
      isActive: true,
    };

    if ((appointment.specialty as any) === SpecialtyTier.CONSULTANT) {
      // Broadcast to everyone EXCEPT Dermatologists
      whereClause.type = { not: SpecialistType.DERMATOLOGIST };
    } else {
      // This should theoretically not be reached if AppointmentService correctly routes 
      // SpecialtyTier.DERMATOLOGIST away from broadcast.
      // But for safety:
      whereClause.type = appointment.specialty as any;
    }

    const specialists = await this.prisma.specialist.findMany({
      where: whereClause,
    });

    if (specialists.length === 0) {
      this.logger.warn(`No active specialists found for broadcast of appointment ${appointmentId} with specialty ${appointment.specialty}`);
      return;
    }

    // 4. Create assignments for all specialists
    for (const specialist of specialists) {
      // Check if already assigned (defensive)
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
          status: SpecialistAssignmentStatus.PENDING,
        });

        // Notify specialist via push/notification and socket
        await this.notifySpecialistAssignment(appointment, specialist);
      }
    }

    // 5. Notify user that we are matching them with specialists
    await this.notifyUserAssignment(appointment);

    this.logger.log(`Broadcasted appointment ${appointmentId} to ${specialists.length} specialists of type ${appointment.specialty}.`);
  }

  async acceptAssignment(assignmentId: string, specialistId: string): Promise<any> {
    const assignment = await this.assignmentRepository.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.specialistId !== specialistId) {
      throw new ForbiddenException('You can only accept your own assignments');
    }

    if (assignment.status !== SpecialistAssignmentStatus.PENDING) {
      throw new BadRequestException('Assignment has already been responded to');
    }

    // Check if appointment is still pending
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: assignment.appointmentId },
      include: { user: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('This appointment has already been accepted by another specialist');
    }

    // Accept assignment
    const updatedAssignment = await this.assignmentRepository.update(assignmentId, {
      status: SpecialistAssignmentStatus.ACCEPTED,
      respondedAt: new Date(),
    });

    // Update appointment
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: assignment.appointmentId },
      data: {
        specialistId,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    // Cancel other pending assignments
    const cancelledCount = await this.assignmentRepository.cancelOtherAssignments(
      assignment.appointmentId,
      assignmentId,
    );

    // Notify user
    const { specialist } = await this.specialistService.findById(specialistId);
    await this.notifyUserSpecialistAccepted(appointment, specialist!);

    // New logic: Send acceptance email to the user
    if (appointment.user && appointment.user.email && specialist) {
      await this.mailService.sendAppointmentAcceptedEmail(appointment.user.email, specialist.lastName || specialist.firstName, appointment);
      
      // 📧 Send confirmation email to the Specialist as well
      await this.mailService.sendSpecialistAppointmentAcceptedEmail(
        specialist.email, 
        `${appointment.user.firstName} ${appointment.user.lastName}`, 
        appointment
      );
    }

    // Notify admin
    if (assignment.assignedBy) {
      await this.notifyAdminSpecialistAccepted(appointment, specialist!, assignment.assignedBy);
    }

    // Notify other specialists
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

  async declineAssignment(assignmentId: string, specialistId: string): Promise<SpecialistAssignmentEntity> {
    const assignment = await this.assignmentRepository.findById(assignmentId);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.specialistId !== specialistId) {
      throw new ForbiddenException('You can only decline your own assignments');
    }

    if (assignment.status !== SpecialistAssignmentStatus.PENDING) {
      throw new BadRequestException('Assignment has already been responded to');
    }

    const updated = await this.assignmentRepository.update(assignmentId, {
      status: SpecialistAssignmentStatus.DECLINED,
      respondedAt: new Date(),
    });

    this.logger.log(`Specialist ${specialistId} declined assignment ${assignmentId}`);
    return updated;
  }

  async getSpecialistAssignments(specialistId: string, status?: SpecialistAssignmentStatus): Promise<any[]> {
    return this.assignmentRepository.findBySpecialistId(specialistId, status);
  }

  async findAllAssignments(): Promise<SpecialistAssignmentEntity[]> {
    return this.assignmentRepository.findAll();
  }

  async getAssignmentsForAppointment(appointmentId: string): Promise<SpecialistAssignmentEntity[]> {
    return this.assignmentRepository.findByAppointmentId(appointmentId);
  }

  private async notifySpecialistAssignment(appointment: any, specialist: any): Promise<void> {
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

  private async notifyUserAssignment(appointment: any): Promise<void> {
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

  private async notifyUserSpecialistAccepted(appointment: any, specialist: any): Promise<void> {
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

  private async notifyOtherSpecialistsCancelled(appointmentId: string, acceptedSpecialistId: string): Promise<void> {
    const cancelledAssignments = await this.assignmentRepository.findByAppointmentId(appointmentId);
    
    for (const assignment of cancelledAssignments) {
      if (assignment.specialistId !== acceptedSpecialistId && assignment.status === SpecialistAssignmentStatus.CANCELLED) {
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

  private async notifyAdminSpecialistAccepted(appointment: any, specialist: any, adminId: string): Promise<void> {
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
}
