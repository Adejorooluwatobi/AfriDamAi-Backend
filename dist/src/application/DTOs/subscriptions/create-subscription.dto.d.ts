export declare class CreateSubscriptionDto {
    userId: string;
    planId: string;
    startDate?: string;
    endDate?: string;
    remainingSessions?: number;
    status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    autoRenew?: boolean;
}
