import { CreateNotificationParams, UpdateNotificationParams } from 'src/utils/type';
import { NotificationEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  findById(id: string): Promise<NotificationEntity | null>;
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  findByAdminId(adminId: string): Promise<NotificationEntity[]>;
  findByVendorId(vendorId: string): Promise<NotificationEntity[]>;
  findBySpecialistId(specialistId: string): Promise<NotificationEntity[]>;
  findAll(): Promise<NotificationEntity[]>;
  create(notification: CreateNotificationParams): Promise<NotificationEntity>;
  markAsRead(id: string): Promise<NotificationEntity>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
