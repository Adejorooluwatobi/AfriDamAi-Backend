import { UserSubscription as PrismaSubscription, PricingPlan as PrismaPricingPlan } from '@prisma/client'; // Import PrismaPricingPlan
import { UserSubscriptionEntity, SubscriptionStatus } from 'src/domain/entities/subscription.entity';

export class SubscriptionMapper {
  static toDomain(prismaSubscription: PrismaSubscription & { pricingPlan?: PrismaPricingPlan }): UserSubscriptionEntity {
    return new UserSubscriptionEntity({
      id: prismaSubscription.id,
      userId: prismaSubscription.userId,
      planId: prismaSubscription.planId,
      startDate: prismaSubscription.startDate,
      endDate: prismaSubscription.endDate ?? undefined,
      remainingSessions: prismaSubscription.remainingSessions,
      status: prismaSubscription.status as SubscriptionStatus,
      autoRenew: prismaSubscription.autoRenew,
      gatewaySubscriptionId: prismaSubscription.gatewaySubscriptionId ?? undefined,
      createdAt: prismaSubscription.createdAt,
      updatedAt: prismaSubscription.updatedAt,
    });
  }
}
