import { Injectable } from '@nestjs/common';
import { IAppointmentRepository } from 'src/domain/repositories/appointment.repository.interface';
import { Appointment } from 'src/domain/entities/appointment.entity';
import { PrismaService } from './prisma.service';
import { UpdateAppointmentParams } from 'src/utils/type';
import { AppointmentStatus, SpecialistType } from '@prisma/client';
import { AppointmentMapper } from 'src/infrastructure/mappers/appointment.mapper';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const data = AppointmentMapper.toPersistence(appointment);
    const created = await this.prisma.appointment.create({
      data: data as any,
    });
    return AppointmentMapper.toDomain(created);
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return AppointmentMapper.toDomainArray(appointments);
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({ 
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        specialist: true,
      }
    });
    return appointment ? AppointmentMapper.toDomain(appointment as any) : null;
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({ 
      where: { userId },
      include: {
        specialist: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return AppointmentMapper.toDomainArray(appointments as any);
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({ 
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
    return AppointmentMapper.toDomainArray(appointments);
  }

  async findBySpecialty(specialty: SpecialistType): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({ 
      where: { specialty: specialty as any },
      orderBy: { createdAt: 'desc' },
    });
    return AppointmentMapper.toDomainArray(appointments);
  }

  async findBySpecialistId(specialistId: string, statuses?: AppointmentStatus[]): Promise<Appointment[]> {
    const where: any = { specialistId };
    if (statuses && statuses.length > 0) {
      where.status = { in: statuses };
    }
    const appointments = await this.prisma.appointment.findMany({ 
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNo: true,
            profile: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return AppointmentMapper.toDomainArray(appointments);
  }

  async update(id: string, params: UpdateAppointmentParams): Promise<Appointment> {
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: params as any,
    });
    return AppointmentMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }
}