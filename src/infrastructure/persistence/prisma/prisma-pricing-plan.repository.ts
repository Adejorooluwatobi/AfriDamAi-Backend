import { ConflictException, Injectable } from '@nestjs/common';
import { IPricingPlanRepository } from 'src/domain/repositories/pricing-plan.repository.interface';
import { PricingPlan } from 'src/domain/entities/pricing-plan.entity';
import { PrismaService } from './prisma.service';
import { AppointmentType, Prisma } from '@prisma/client';
import { UpdatePricingPlanParams } from 'src/utils/type';
import { PricingPlanMapper } from 'src/infrastructure/mappers/pricing-plan.mapper';

@Injectable()
export class PrismaPricingPlanRepository implements IPricingPlanRepository {
  constructor(private prisma: PrismaService) {}

  async create(plan: PricingPlan): Promise<PricingPlan> {
    const { id, durationDays, appointmentLimit, ...restOfPlan } = plan;
    const dataForPrisma = {
      ...restOfPlan,
      duration: durationDays ?? null,
      appointmentLimit: appointmentLimit ?? null,
      isInstantSession: restOfPlan.isInstantSession ?? false,
      paystackPlanCode: restOfPlan.paystackPlanCode ?? null,
    };
    const created = await this.prisma.pricingPlan.create({
      data: dataForPrisma as any,
    });
    return PricingPlanMapper.toDomain(created);
  }

  async findAll(): Promise<PricingPlan[]> {
    const plans = await this.prisma.pricingPlan.findMany({
      where: { isDeleted: false }
    });
    return PricingPlanMapper.toDomainArray(plans);
  }

  async findByType(type: AppointmentType): Promise<PricingPlan[]> {
    const plans = await this.prisma.pricingPlan.findMany({
      where: { type, isActive: true, isDeleted: false },
    });
    return PricingPlanMapper.toDomainArray(plans);
  }

  async findActive(): Promise<PricingPlan[]> {
    const plans = await this.prisma.pricingPlan.findMany({ 
      where: { isActive: true, isDeleted: false } 
    });
    return PricingPlanMapper.toDomainArray(plans);
  }

  async findById(id: string): Promise<PricingPlan | null> {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    return plan ? PricingPlanMapper.toDomain(plan) : null;
  }

  async update(id: string, params: UpdatePricingPlanParams): Promise<PricingPlan> {
    const { durationDays, ...rest } = params;
    const updated = await this.prisma.pricingPlan.update({
      where: { id },
      data: {
        ...rest,
        duration: durationDays !== undefined ? durationDays : undefined,
        type: params.type ? (params.type as string) : undefined,
        paystackPlanCode: params.paystackPlanCode || null,
      } as any,
    });
    return PricingPlanMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) return;

    const deletedName = `${plan.id}_DELETED_${plan.name}`;
    
    await this.prisma.pricingPlan.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        deletedAt: new Date(),
        name: deletedName
      }
    });
  }

  /**
   * 🔄 Mapper: Converts Prisma database object back to Domain Entity
   */
  // src/infrastructure/persistence/prisma/prisma-pricing-plan.repository.ts

// private mapToEntity(data: any): PricingPlan {
//   return new PricingPlan({
//     id: data.id,
//     name: data.name,
//     type: data.type,
//     price: Number(data.price),
//     description: data.description ?? [],
//     isActive: data.isActive,
//     createdAt: data.createdAt,
//     updatedAt: data.updatedAt
//   });
// }
}