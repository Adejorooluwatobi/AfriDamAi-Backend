export declare class CreateNotificationDto {
    userId?: string;
    adminId?: string;
    vendorId?: string;
    specialistId?: string;
    isGeneral?: boolean;
    title: string;
    message: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
    isDelivered?: boolean;
    readAt?: Date;
    deliveredAt?: Date;
}
