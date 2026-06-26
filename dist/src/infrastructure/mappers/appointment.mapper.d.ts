import { Appointment } from '@prisma/client';
import { Appointment as AppointmentEntity } from '../../domain/entities/appointment.entity';
export declare class AppointmentMapper {
    static toDomain(prismaAppointment: Appointment & {
        user?: any;
        specialist?: any;
    }): AppointmentEntity;
    static toDomainArray(prismaAppointments: Appointment[]): AppointmentEntity[];
    static toPersistence(appointment: AppointmentEntity): Omit<Appointment, 'createdAt' | 'updatedAt'>;
}
