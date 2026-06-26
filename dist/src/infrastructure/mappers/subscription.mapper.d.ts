import { UserSubscription as PrismaSubscription, PricingPlan as PrismaPricingPlan } from '@prisma/client';
import { UserSubscriptionEntity } from 'src/domain/entities/subscription.entity';
export declare class SubscriptionMapper {
    static toDomain(prismaSubscription: PrismaSubscription & {
        pricingPlan?: PrismaPricingPlan;
    }): UserSubscriptionEntity;
}
