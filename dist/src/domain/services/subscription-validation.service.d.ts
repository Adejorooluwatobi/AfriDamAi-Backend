import { SubscriptionService } from './subscription.service';
import { UserSubscriptionWithPlan } from '../types/subscription.types';
export interface SubscriptionEligibility {
    eligible: boolean;
    reason?: string;
    subscription?: UserSubscriptionWithPlan;
    daysRemaining?: number;
}
export declare class SubscriptionValidationService {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    validateSubscriptionForAppointment(userId: string): Promise<SubscriptionEligibility>;
    calculateDaysRemaining(endDate: Date | null): number;
}
