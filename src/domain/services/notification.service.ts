import { 
  Inject, 
  Injectable, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';
import { NotificationEntity } from '../entities/notification.entity';
import { INotificationRepository } from '../repositories/notification.repository.interface';
import { CreateNotificationParams } from 'src/utils/type';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('INotificationRepository') private readonly notificationRepository: INotificationRepository
  ) {}

  async createNotification(params: CreateNotificationParams): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.create(params);
    // this.logger.log(`Notification created for user/entity`);
    return notification;
  }

  async findById(id: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }

  async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async getAdminNotifications(adminId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByAdminId(adminId);
  }

   async getVendorNotifications(vendorId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByVendorId(vendorId);
  }

   async getSpecialistNotifications(specialistId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findBySpecialistId(specialistId);
  }

  async getAllNotifications(): Promise<NotificationEntity[]> {
    return this.notificationRepository.findAll();
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    await this.findById(id);
    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string): Promise<void> {
    await this.findById(id);
    await this.notificationRepository.delete(id);
  }
}
