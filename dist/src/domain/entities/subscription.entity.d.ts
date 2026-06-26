export declare enum SubscriptionStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare class UserSubscriptionEntity {
    id: string;
    userId: string;
    planId: string;
    startDate: Date;
    endDate?: Date;
    remainingSessions?: number;
    status: SubscriptionStatus;
    autoRenew: boolean;
    createdAt: Date;
    gatewaySubscriptionId?: string;
    updatedAt: Date;
    constructor(partial: Partial<UserSubscriptionEntity>);
}
