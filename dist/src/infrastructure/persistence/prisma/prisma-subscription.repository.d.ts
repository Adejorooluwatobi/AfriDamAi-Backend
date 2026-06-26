import { ISubscriptionRepository } from 'src/domain/repositories/subscription.repository.interface';
import { UserSubscriptionEntity } from 'src/domain/entities/subscription.entity';
import { CreateSubscriptionParams, UpdateSubscriptionParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { UserSubscription as PrismaSubscription, PricingPlan as PrismaPricingPlan } from '@prisma/client';
export declare class PrismaSubscriptionRepository implements ISubscriptionRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateSubscriptionParams): Promise<UserSubscriptionEntity>;
    findById(id: string): Promise<UserSubscriptionEntity | null>;
    findByIdWithPlan(id: string): Promise<(PrismaSubscription & {
        pricingPlan: PrismaPricingPlan;
    }) | null>;
    findByUserId(userId: string): Promise<UserSubscriptionEntity[]>;
    findByUserIdWithPlan(userId: string): Promise<(PrismaSubscription & {
        pricingPlan: PrismaPricingPlan;
    })[]>;
    findActiveByUserId(userId: string): Promise<UserSubscriptionEntity | null>;
    update(id: string, params: UpdateSubscriptionParams): Promise<UserSubscriptionEntity>;
    findByGatewaySubscriptionId(gatewaySubscriptionId: string): Promise<UserSubscriptionEntity | null>;
    delete(id: string): Promise<void>;
    findUsersByStatus(status: string): Promise<any[]>;
}
