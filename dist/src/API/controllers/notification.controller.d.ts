import { NotificationService } from 'src/domain/services/notification.service';
import { CreateNotificationDto } from 'src/application/DTOs/notification/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    getMyNotifications(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any[];
    }>;
    getAllNotifications(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any[];
    }>;
    markAsRead(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    markAllAsRead(req: any): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    remove(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    private extractUserId;
}
