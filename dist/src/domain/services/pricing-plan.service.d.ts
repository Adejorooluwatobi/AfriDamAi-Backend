import { PricingPlan } from '../entities/pricing-plan.entity';
import type { IPricingPlanRepository } from '../repositories/pricing-plan.repository.interface';
import { AppointmentType } from '@prisma/client';
import { CreatePricingPlanParams, UpdatePricingPlanParams } from 'src/utils/type';
export declare class PricingPlanService {
    private readonly pricingPlanRepository;
    constructor(pricingPlanRepository: IPricingPlanRepository);
    findAll(): Promise<PricingPlan[]>;
    findActive(): Promise<PricingPlan[]>;
    getActivePlans(): Promise<PricingPlan[]>;
    findByType(type: AppointmentType): Promise<PricingPlan[]>;
    findOne(id: string): Promise<PricingPlan | null>;
    create(params: CreatePricingPlanParams): Promise<PricingPlan>;
    update(id: string, params: UpdatePricingPlanParams): Promise<PricingPlan>;
    delete(id: string): Promise<void>;
    seedDefaultPricingPlans(): Promise<PricingPlan[]>;
}
