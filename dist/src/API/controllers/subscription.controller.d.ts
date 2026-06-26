import { SubscriptionService } from 'src/domain/services/subscription.service';
import { CreateSubscriptionDto } from 'src/application/DTOs/subscriptions/create-subscription.dto';
import { UpdateSubscriptionDto } from 'src/application/DTOs/subscriptions/update-subscription.dto';
import { GrantSubscriptionDto } from 'src/application/DTOs/subscriptions/grant-subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getMyActiveSubscription(req: any): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    getMySubscriptions(req: any): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity[]>;
    createSubscription(createDto: CreateSubscriptionDto): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    updateSubscription(id: string, updateDto: UpdateSubscriptionDto): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    toggleAutoRenew(id: string, body: {
        autoRenew: boolean;
    }): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    endInstantSession(id: string): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    updateSessions(id: string, body: {
        sessions: number;
    }): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    grantSessions(body: {
        userId: string;
        sessions: number;
    }): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    grantPlan(grantDto: GrantSubscriptionDto): Promise<import("../../domain/entities/subscription.entity").UserSubscriptionEntity>;
    getActiveUsers(): Promise<any[]>;
    getExpiredUsers(): Promise<any[]>;
}
