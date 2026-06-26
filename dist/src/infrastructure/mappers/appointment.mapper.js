"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentMapper = void 0;
const appointment_entity_1 = require("../../domain/entities/appointment.entity");
class AppointmentMapper {
    static toDomain(prismaAppointment) {
        return new appointment_entity_1.Appointment({
            id: prismaAppointment.id,
            userId: prismaAppointment.userId,
            subscriptionId: prismaAppointment.subscriptionId ?? undefined,
            specialistId: prismaAppointment.specialistId ?? undefined,
            specialty: prismaAppointment.specialty,
            type: prismaAppointment.type,
            status: prismaAppointment.status,
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
    static toDomainArray(prismaAppointments) {
        return prismaAppointments.map(appointment => this.toDomain(appointment));
    }
    static toPersistence(appointment) {
        const data = {
            userId: appointment.userId,
            subscriptionId: appointment.subscriptionId ?? null,
            specialistId: appointment.specialistId ?? null,
            specialty: appointment.specialty,
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
exports.AppointmentMapper = AppointmentMapper;
//# sourceMappingURL=appointment.mapper.js.map