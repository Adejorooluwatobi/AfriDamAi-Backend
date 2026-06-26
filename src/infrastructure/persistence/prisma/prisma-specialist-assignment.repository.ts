import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ISpecialistAssignmentRepository } from 'src/domain/repositories/specialist-assignment.repository.interface';
import { SpecialistAssignmentEntity, SpecialistAssignmentStatus } from 'src/domain/entities/specialist-assignment.entity';
import { SpecialistAssignmentMapper } from 'src/infrastructure/mappers/specialist-assignment.mapper';

@Injectable()
export class PrismaSpecialistAssignmentRepository implements ISpecialistAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(assignment: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity> {
    const created = await this.prisma.specialistAssignment.create({
      data: {
        appointmentId: assignment.appointmentId!,
        specialistId: assignment.specialistId!,
        assignedBy: assignment.assignedBy!,
        status: assignment.status || 'PENDING',
      },
      include: {
        appointment: true,
        specialist: true,
      },
    });
    return SpecialistAssignmentMapper.toDomain(created);
  }

  async findById(id: string): Promise<SpecialistAssignmentEntity | null> {
    const assignment = await this.prisma.specialistAssignment.findUnique({
      where: { id },
      include: {
        appointment: true,
        specialist: true,
      },
    });
    return assignment ? SpecialistAssignmentMapper.toDomain(assignment) : null;
  }

  async findByAppointmentId(appointmentId: string): Promise<SpecialistAssignmentEntity[]> {
    const assignments = await this.prisma.specialistAssignment.findMany({
      where: { appointmentId },
      include: {
        appointment: true,
        specialist: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return assignments.map(SpecialistAssignmentMapper.toDomain);
  }

  async findBySpecialistId(specialistId: string, status?: SpecialistAssignmentStatus): Promise<SpecialistAssignmentEntity[]> {
    const assignments = await this.prisma.specialistAssignment.findMany({
      where: {
        specialistId,
        ...(status && { status }),
      },
      include: {
        appointment: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: true,
              },
            },
          },
        },
        specialist: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return assignments.map(SpecialistAssignmentMapper.toDomain);
  }

  async update(id: string, data: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity> {
    const updated = await this.prisma.specialistAssignment.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.respondedAt && { respondedAt: data.respondedAt }),
      },
      include: {
        appointment: true,
        specialist: true,
      },
    });
    return SpecialistAssignmentMapper.toDomain(updated);
  }

  async cancelOtherAssignments(appointmentId: string, acceptedAssignmentId: string): Promise<number> {
    const result = await this.prisma.specialistAssignment.updateMany({
      where: {
        appointmentId,
        id: { not: acceptedAssignmentId },
        status: 'PENDING',
      },
      data: {
        status: 'CANCELLED',
        respondedAt: new Date(),
      },
    });
    return result.count;
  }

  async findAll(): Promise<SpecialistAssignmentEntity[]> {
    const assignments = await this.prisma.specialistAssignment.findMany({
      include: {
        appointment: true,
        specialist: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return assignments.map(SpecialistAssignmentMapper.toDomain);
  }
}
