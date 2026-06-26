export declare class NotificationEntity {
    id: string;
    userId?: string;
    adminId?: string;
    vendorId?: string;
    specialistId?: string;
    isGeneral: boolean;
    title: string;
    message: string;
    isRead: boolean;
    isDelivered: boolean;
    readAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    constructor(partial: Partial<NotificationEntity>);
}
