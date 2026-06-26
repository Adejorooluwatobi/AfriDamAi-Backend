"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistAssignmentMapper = void 0;
const specialist_assignment_entity_1 = require("../../domain/entities/specialist-assignment.entity");
class SpecialistAssignmentMapper {
    static toDomain(prismaAssignment) {
        return new specialist_assignment_entity_1.SpecialistAssignmentEntity({
            id: prismaAssignment.id,
            appointmentId: prismaAssignment.appointmentId,
            specialistId: prismaAssignment.specialistId,
            assignedBy: prismaAssignment.assignedBy,
            status: prismaAssignment.status,
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
    static toDomainArray(prismaAssignments) {
        return prismaAssignments.map(this.toDomain);
    }
}
exports.SpecialistAssignmentMapper = SpecialistAssignmentMapper;
//# sourceMappingURL=specialist-assignment.mapper.js.map