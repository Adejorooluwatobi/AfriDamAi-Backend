import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { CreateNotificationParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class NotificationRepository implements INotificationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<NotificationEntity | null>;
    findByUserId(userId: string): Promise<NotificationEntity[]>;
    findByAdminId(adminId: string): Promise<NotificationEntity[]>;
    findByVendorId(vendorId: string): Promise<NotificationEntity[]>;
    findBySpecialistId(specialistId: string): Promise<NotificationEntity[]>;
    findAll(): Promise<NotificationEntity[]>;
    create(params: CreateNotificationParams): Promise<NotificationEntity>;
    markAsRead(id: string): Promise<NotificationEntity>;
    markAllAsRead(id: string): Promise<void>;
    delete(id: string): Promise<void>;
}
