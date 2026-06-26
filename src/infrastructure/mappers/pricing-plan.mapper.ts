import { PricingPlan } from '@prisma/client';
import { PricingPlan as PricingPlanEntity } from '../../domain/entities/pricing-plan.entity';

export class PricingPlanMapper {

static toDomain(prismaPricingPlan: PricingPlan): PricingPlanEntity {
  return new PricingPlanEntity({
    id: prismaPricingPlan.id,
    name: prismaPricingPlan.name,
    type: prismaPricingPlan.type,
    price: prismaPricingPlan.price,
    durationDays: prismaPricingPlan.duration ?? undefined,
    appointmentLimit: prismaPricingPlan.appointmentLimit ?? undefined,
    isInstantSession: prismaPricingPlan.isInstantSession,
    description: prismaPricingPlan.description,
    isActive: prismaPricingPlan.isActive,
    isDeleted: (prismaPricingPlan as any).isDeleted,
    deletedAt: (prismaPricingPlan as any).deletedAt ?? undefined,
    createdAt: prismaPricingPlan.createdAt,
    paystackPlanCode: prismaPricingPlan.paystackPlanCode ?? undefined,
    updatedAt: prismaPricingPlan.updatedAt,
  });
}

  static toDomainArray(prismaPricingPlans: PricingPlan[]): PricingPlanEntity[] {
    return prismaPricingPlans.map(plan => this.toDomain(plan));
  }

  static toPersistence(pricingPlan: PricingPlanEntity): Omit<PricingPlan, 'createdAt' | 'updatedAt'> {
    return {
      id: pricingPlan.id,
      name: pricingPlan.name,
      type: pricingPlan.type,
      price: pricingPlan.price,
      duration: pricingPlan.durationDays ?? null,
      appointmentLimit: pricingPlan.appointmentLimit ?? null,
      isInstantSession: pricingPlan.isInstantSession ?? false,
      description: pricingPlan.description,
      isActive: pricingPlan.isActive,
      isDeleted: pricingPlan.isDeleted,
      deletedAt: pricingPlan.deletedAt ?? null,
      paystackPlanCode: pricingPlan.paystackPlanCode ?? null,
    };
  }
}