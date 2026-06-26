import { NotificationEntity } from '../../domain/entities/notification.entity';
import { Notification } from '@prisma/client';

export class NotificationMapper {
  static toDomain(raw: Notification): NotificationEntity {
    return new NotificationEntity({
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

  static toDomainArray(raws: Notification[]): NotificationEntity[] {
    return raws.map(n => this.toDomain(n));
  }

  static toPersistence(domain: NotificationEntity): Notification {
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

  static toDto(entity: NotificationEntity): any {
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
