import { Appointment, SpecialtyTier } from '@prisma/client';
import { Appointment as AppointmentEntity } from '../../domain/entities/appointment.entity';

export class AppointmentMapper {
  static toDomain(prismaAppointment: Appointment & { user?: any, specialist?: any }): AppointmentEntity {
    return new AppointmentEntity({
      id: prismaAppointment.id,
      userId: prismaAppointment.userId,
      subscriptionId: prismaAppointment.subscriptionId ?? undefined,
      specialistId: prismaAppointment.specialistId ?? undefined,
      specialty: prismaAppointment.specialty as SpecialtyTier,
      type: prismaAppointment.type as any,
      status: prismaAppointment.status as any,
      price: prismaAppointment.price,
      scheduledAt: prismaAppointment.scheduledAt ?? undefined,
      startedAt: prismaAppointment.startedAt ?? undefined,
      endedAt: prismaAppointment.endedAt ?? undefined,
      endRequestedBy: prismaAppointment.endRequestedBy ?? undefined,
      endRequestedAt: prismaAppointment.endRequestedAt ?? undefined,
      isExtended: prismaAppointment.isExtended,
      notes: prismaAppointment.notes ?? undefined,
      meetingLink: prismaAppointment.meetingLink ?? undefined,
      createdAt: prismaAppointment.createdAt,
      updatedAt: prismaAppointment.updatedAt,
      user: prismaAppointment.user ? prismaAppointment.user : undefined,
      specialist: prismaAppointment.specialist ? prismaAppointment.specialist : undefined,
    });
  }


  static toDomainArray(prismaAppointments: Appointment[]): AppointmentEntity[] {
    return prismaAppointments.map(appointment => this.toDomain(appointment));
  }

  static toPersistence(appointment: AppointmentEntity): Omit<Appointment, 'createdAt' | 'updatedAt'> {
    const data: any = {
      userId: appointment.userId,
      subscriptionId: appointment.subscriptionId ?? null,
      specialistId: appointment.specialistId ?? null,
      specialty: appointment.specialty as any,
      type: appointment.type,
      status: appointment.status,
      price: appointment.price,
      scheduledAt: appointment.scheduledAt ?? null,
      startedAt: appointment.startedAt ?? null,
      endedAt: appointment.endedAt ?? null,
      endRequestedBy: appointment.endRequestedBy ?? null,
      endRequestedAt: appointment.endRequestedAt ?? null,
      isExtended: appointment.isExtended,
      notes: appointment.notes ?? null,
      meetingLink: appointment.meetingLink ?? null,
    };

    if (appointment.id && appointment.id !== '') {
      data.id = appointment.id;
    }

    return data;
  }
}