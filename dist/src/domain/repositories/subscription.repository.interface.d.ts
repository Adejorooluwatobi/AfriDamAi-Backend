import { UserSubscriptionEntity } from '../entities/subscription.entity';
import { CreateSubscriptionParams, UpdateSubscriptionParams } from 'src/utils/type';
import { UserSubscription as PrismaSubscription, PricingPlan as PrismaPricingPlan } from '@prisma/client';
export interface ISubscriptionRepository {
    create(params: CreateSubscriptionParams): Promise<UserSubscriptionEntity>;
    findById(id: string): Promise<UserSubscriptionEntity | null>;
    findByIdWithPlan(id: string): Promise<(PrismaSubscription & {
        pricingPlan: PrismaPricingPlan;
    }) | null>;
    findByUserId(userId: string): Promise<UserSubscriptionEntity[]>;
    findByUserIdWithPlan(userId: string): Promise<(PrismaSubscription & {
        pricingPlan: PrismaPricingPlan;
    })[]>;
    update(id: string, params: UpdateSubscriptionParams): Promise<UserSubscriptionEntity>;
    delete(id: string): Promise<void>;
    findActiveByUserId(userId: string): Promise<UserSubscriptionEntity | null>;
    findByGatewaySubscriptionId(gatewaySubscriptionId: string): Promise<UserSubscriptionEntity | null>;
    findUsersByStatus(status: string): Promise<any[]>;
}
