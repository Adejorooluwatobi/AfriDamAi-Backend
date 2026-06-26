import { NotificationEntity } from '../entities/notification.entity';
import { INotificationRepository } from '../repositories/notification.repository.interface';
import { CreateNotificationParams } from 'src/utils/type';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly logger;
    constructor(notificationRepository: INotificationRepository);
    createNotification(params: CreateNotificationParams): Promise<NotificationEntity>;
    findById(id: string): Promise<NotificationEntity>;
    getUserNotifications(userId: string): Promise<NotificationEntity[]>;
    getAdminNotifications(adminId: string): Promise<NotificationEntity[]>;
    getVendorNotifications(vendorId: string): Promise<NotificationEntity[]>;
    getSpecialistNotifications(specialistId: string): Promise<NotificationEntity[]>;
    getAllNotifications(): Promise<NotificationEntity[]>;
    markAsRead(id: string): Promise<NotificationEntity>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(id: string): Promise<void>;
}
