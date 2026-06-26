export declare class UpdateSubscriptionDto {
    startDate?: string;
    endDate?: string;
    remainingSessions?: number;
    status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    autoRenew?: boolean;
}
