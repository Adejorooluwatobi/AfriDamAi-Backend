import { PricingPlan } from '@prisma/client';
import { PricingPlan as PricingPlanEntity } from '../../domain/entities/pricing-plan.entity';
export declare class PricingPlanMapper {
    static toDomain(prismaPricingPlan: PricingPlan): PricingPlanEntity;
    static toDomainArray(prismaPricingPlans: PricingPlan[]): PricingPlanEntity[];
    static toPersistence(pricingPlan: PricingPlanEntity): Omit<PricingPlan, 'createdAt' | 'updatedAt'>;
}
