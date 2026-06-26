import { PricingPlan } from '../entities/pricing-plan.entity';
import { AppointmentType } from '@prisma/client';
import { UpdatePricingPlanParams } from 'src/utils/type';

export interface IPricingPlanRepository {
  // 🛠️ FIX: Expect the Domain Entity instead of raw params
  create(plan: PricingPlan): Promise<PricingPlan>;
  findById(id: string): Promise<PricingPlan | null>;
  findAll(): Promise<PricingPlan[]>;
  findByType(type: AppointmentType): Promise<PricingPlan[]>;
  findActive(): Promise<PricingPlan[]>;
  update(id: string, params: UpdatePricingPlanParams): Promise<PricingPlan>;
  delete(id: string): Promise<void>;
}