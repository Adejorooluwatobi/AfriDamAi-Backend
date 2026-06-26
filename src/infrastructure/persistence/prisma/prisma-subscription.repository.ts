import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/domain/repositories/subscription.repository.interface';
import { UserSubscriptionEntity, SubscriptionStatus } from 'src/domain/entities/subscription.entity';
import { CreateSubscriptionParams, UpdateSubscriptionParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { SubscriptionMapper } from 'src/infrastructure/mappers/subscription.mapper';
import { UserSubscription as PrismaSubscription, PricingPlan as PrismaPricingPlan, UserSubscription } from '@prisma/client'; // Import Prisma types

@Injectable()
export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: CreateSubscriptionParams): Promise<UserSubscriptionEntity> {
    const subscription = await this.prisma.userSubscription.create({
      data: params as UserSubscription,
    });
    return SubscriptionMapper.toDomain(subscription);
  }

  async findById(id: string): Promise<UserSubscriptionEntity | null> {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { id },
    });
    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async findByIdWithPlan(
    id: string,
  ): Promise<(PrismaSubscription & { pricingPlan: PrismaPricingPlan }) | null> {
    const subscriptionWithPlan = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: {
        pricingPlan: true, // Eager-load the related PricingPlan
      },
    });
    return subscriptionWithPlan as (PrismaSubscription & { pricingPlan: PrismaPricingPlan }) | null;
  }

  async findByUserId(userId: string): Promise<UserSubscriptionEntity[]> {
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return subscriptions.map(SubscriptionMapper.toDomain);
  }

  async findByUserIdWithPlan(
    userId: string,
  ): Promise<(PrismaSubscription & { pricingPlan: PrismaPricingPlan })[]> {
    const subscriptionsWithPlan = await this.prisma.userSubscription.findMany({
      where: { userId },
      include: {
        pricingPlan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return subscriptionsWithPlan as (PrismaSubscription & { pricingPlan: PrismaPricingPlan })[];
  }

  async findActiveByUserId(userId: string): Promise<UserSubscriptionEntity | null> {
    const subscription = await this.prisma.userSubscription.findFirst({
        where: {
            userId,
            status: 'ACTIVE',
            endDate: { gt: new Date() } // Should be active and not expired
        },
        orderBy: { endDate: 'desc' } // Get the one ending latest if multiple exist
    });
    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async update(id: string, params: UpdateSubscriptionParams): Promise<UserSubscriptionEntity> {
    const subscription = await this.prisma.userSubscription.update({
      where: { id },
      data: {
        startDate: params.startDate,
        endDate: params.endDate,
        status: params.status as any,
        autoRenew: params.autoRenew,
        remainingSessions: params.remainingSessions,
        gatewaySubscriptionId: params.gatewaySubscriptionId,
      },
    });
    return SubscriptionMapper.toDomain(subscription);
  }

  async findByGatewaySubscriptionId(gatewaySubscriptionId: string): Promise<UserSubscriptionEntity | null> {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { gatewaySubscriptionId },
    });
    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userSubscription.delete({
      where: { id },
    });
  }

  async findUsersByStatus(status: string): Promise<any[]> {
    const now = new Date();
    
    // We want to find users whose LATEST subscription matches the status
    // Or for 'ACTIVE', anyone with an active one.
    // For simplicity and matching user expectation:
    
    if (status === 'ACTIVE') {
      return this.prisma.user.findMany({
        where: {
          subscriptions: {
            some: {
              status: 'ACTIVE',
              endDate: { gt: now }
            }
          }
        },
        include: {
          subscriptions: {
            where: {
              status: 'ACTIVE',
              endDate: { gt: now }
            },
            include: {
              pricingPlan: true
            }
          },
          currentPricingPlan: true,
          profile: true
        }
      });
    } else if (status === 'EXPIRED') {
      // Users who have NO active subscriptions BUT have at least one expired one
      return this.prisma.user.findMany({
        where: {
          AND: [
            {
              subscriptions: {
                none: {
                  status: 'ACTIVE',
                  endDate: { gt: now }
                }
              }
            },
            {
              subscriptions: {
                some: {
                  OR: [
                    { status: 'EXPIRED' },
                    { 
                      status: 'ACTIVE',
                      endDate: { lte: now }
                    }
                  ]
                }
              }
            }
          ]
        },
        include: {
          subscriptions: {
            orderBy: { endDate: 'desc' },
            take: 1,
            include: {
              pricingPlan: true
            }
          },
          currentPricingPlan: true,
          profile: true
        }
      });
    }
    
    return [];
  }
}
