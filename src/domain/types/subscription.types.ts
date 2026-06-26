import { UserSubscriptionEntity } from "../entities/subscription.entity";
import { PricingPlan as PricingPlanEntity } from "../entities/pricing-plan.entity";

export type UserSubscriptionWithPlan = UserSubscriptionEntity & { pricingPlan: PricingPlanEntity; };
