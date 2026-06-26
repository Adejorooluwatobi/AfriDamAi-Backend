"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
const notification_entity_1 = require("../../domain/entities/notification.entity");
class NotificationMapper {
    static toDomain(raw) {
        return new notification_entity_1.NotificationEntity({
            id: raw.id,
            userId: raw.userId ?? undefined,
            adminId: raw.adminId ?? undefined,
            vendorId: raw.vendorId ?? undefined,
            specialistId: raw.specialistId ?? undefined,
            isGeneral: raw.isGeneral,
            title: raw.title,
            message: raw.message,
            isRead: raw.isRead,
            isDelivered: raw.isDelivered,
            readAt: raw.readAt ?? undefined,
            deliveredAt: raw.deliveredAt ?? undefined,
            createdAt: raw.createdAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map(n => this.toDomain(n));
    }
    static toPersistence(domain) {
        return {
            id: domain.id,
            userId: domain.userId ?? null,
            adminId: domain.adminId ?? null,
            vendorId: domain.vendorId ?? null,
            specialistId: domain.specialistId ?? null,
            isGeneral: domain.isGeneral,
            title: domain.title,
            message: domain.message,
            isRead: domain.isRead,
            isDelivered: domain.isDelivered,
            readAt: domain.readAt ?? null,
            deliveredAt: domain.deliveredAt ?? null,
            createdAt: domain.createdAt,
        };
    }
    static toDto(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            adminId: entity.adminId,
            vendorId: entity.vendorId,
            specialistId: entity.specialistId,
            isGeneral: entity.isGeneral,
            title: entity.title,
            message: entity.message,
            isRead: entity.isRead,
            isDelivered: entity.isDelivered,
            readAt: entity.readAt,
            deliveredAt: entity.deliveredAt,
            createdAt: entity.createdAt,
        };
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=notification.mapper.js.map