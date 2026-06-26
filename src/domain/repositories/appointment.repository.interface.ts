import { Appointment } from '../entities/appointment.entity';
import { SpecialistType, AppointmentStatus } from '@prisma/client';
import { UpdateAppointmentParams } from 'src/utils/type';

export interface IAppointmentRepository {
  // 🛠️ FIX: Changed parameter to 'Appointment' entity to match Service and Repository logic
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