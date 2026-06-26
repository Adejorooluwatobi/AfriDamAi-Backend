import { PricingPlanService } from '../../domain/services/pricing-plan.service';
import { CreatePricingPlanDto } from 'src/application/DTOs/pricing-plans/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from 'src/application/DTOs/pricing-plans/update-pricing-plan.dto';
export declare class PricingPlanController {
    private readonly pricingPlanService;
    constructor(pricingPlanService: PricingPlanService);
    getActivePricingPlans(): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan[]>;
    seedDefaultPricingPlans(): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan[]>;
    findAll(): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan[]>;
    create(createPricingPlanDto: CreatePricingPlanDto): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan>;
    findOne(id: string): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan>;
    update(id: string, updatePricingPlanDto: UpdatePricingPlanDto): Promise<import("../../domain/entities/pricing-plan.entity").PricingPlan>;
    remove(id: string): Promise<void>;
}
