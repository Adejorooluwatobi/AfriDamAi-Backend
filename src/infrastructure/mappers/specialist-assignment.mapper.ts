import { SpecialistAssignment } from '@prisma/client';
import { SpecialistAssignmentEntity, SpecialistAssignmentStatus } from 'src/domain/entities/specialist-assignment.entity';

export class SpecialistAssignmentMapper {
  static toDomain(prismaAssignment: any): SpecialistAssignmentEntity {
    return new SpecialistAssignmentEntity({
      id: prismaAssignment.id,
      appointmentId: prismaAssignment.appointmentId,
      specialistId: prismaAssignment.specialistId,
      assignedBy: prismaAssignment.assignedBy,
      status: prismaAssignment.status as SpecialistAssignmentStatus,
      assignedAt: prismaAssignment.assignedAt,
      respondedAt: prismaAssignment.respondedAt ?? undefined,
      createdAt: prismaAssignment.createdAt,
      updatedAt: prismaAssignment.updatedAt,
      appointment: prismaAssignment.appointment ? {
        ...prismaAssignment.appointment,
        user: prismaAssignment.appointment.user ? {
          id: prismaAssignment.appointment.user.id,
          firstName: prismaAssignment.appointment.user.firstName,
          lastName: prismaAssignment.appointment.user.lastName,
          email: prismaAssignment.appointment.user.email,
          profile: prismaAssignment.appointment.user.profile,
        } : undefined
      } : undefined
    });
  }

  static toDomainArray(prismaAssignments: any[]): SpecialistAssignmentEntity[] {
    return prismaAssignments.map(this.toDomain);
  }
}
