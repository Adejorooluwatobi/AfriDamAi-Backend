import { IAppointmentRepository } from 'src/domain/repositories/appointment.repository.interface';
import { Appointment } from 'src/domain/entities/appointment.entity';
import { PrismaService } from './prisma.service';
import { UpdateAppointmentParams } from 'src/utils/type';
import { AppointmentStatus, SpecialistType } from '@prisma/client';
export declare class PrismaAppointmentRepository implements IAppointmentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(appointment: Appointment): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findById(id: string): Promise<Appointment | null>;
    findByUserId(userId: string): Promise<Appointment[]>;
    findByStatus(status: AppointmentStatus): Promise<Appointment[]>;
    findBySpecialty(specialty: SpecialistType): Promise<Appointment[]>;
    findBySpecialistId(specialistId: string, statuses?: AppointmentStatus[]): Promise<Appointment[]>;
    update(id: string, params: UpdateAppointmentParams): Promise<Appointment>;
    delete(id: string): Promise<void>;
}
