import { NotificationEntity } from '../../domain/entities/notification.entity';
import { Notification } from '@prisma/client';
export declare class NotificationMapper {
    static toDomain(raw: Notification): NotificationEntity;
    static toDomainArray(raws: Notification[]): NotificationEntity[];
    static toPersistence(domain: NotificationEntity): Notification;
    static toDto(entity: NotificationEntity): any;
}
