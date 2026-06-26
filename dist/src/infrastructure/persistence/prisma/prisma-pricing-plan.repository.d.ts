import { IPricingPlanRepository } from 'src/domain/repositories/pricing-plan.repository.interface';
import { PricingPlan } from 'src/domain/entities/pricing-plan.entity';
import { PrismaService } from './prisma.service';
import { AppointmentType } from '@prisma/client';
import { UpdatePricingPlanParams } from 'src/utils/type';
export declare class PrismaPricingPlanRepository implements IPricingPlanRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(plan: PricingPlan): Promise<PricingPlan>;
    findAll(): Promise<PricingPlan[]>;
    findByType(type: AppointmentType): Promise<PricingPlan[]>;
    findActive(): Promise<PricingPlan[]>;
    findById(id: string): Promise<PricingPlan | null>;
    update(id: string, params: UpdatePricingPlanParams): Promise<PricingPlan>;
    delete(id: string): Promise<void>;
}
