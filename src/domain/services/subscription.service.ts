import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserSubscriptionEntity } from '../entities/subscription.entity';
import { ISubscriptionRepository } from '../repositories/subscription.repository.interface';
import { CreateSubscriptionParams, UpdateSubscriptionParams, GrantSubscriptionParams } from 'src/utils/type';
import { PricingPlanService } from './pricing-plan.service';
import { addDays } from 'date-fns';
import { SubscriptionStatus } from '../entities/subscription.entity'; // Import SubscriptionStatus enum
import { SubscriptionMapper } from 'src/infrastructure/mappers/subscription.mapper'; // Import SubscriptionMapper
import { PricingPlanMapper } from 'src/infrastructure/mappers/pricing-plan.mapper'; // Import PricingPlanMapper
import { PricingPlan as PricingPlanEntity } from '../entities/pricing-plan.entity'; // Import PricingPlanEntity
import { UserSubscriptionWithPlan } from '../types/subscription.types'; // Import UserSubscriptionWithPlan type
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service'; // Import PrismaService
import { UserMapper } from 'src/infrastructure/mappers/user.mapper'; // Import UserMapper
import { AdminNotificationService } from './admin-notification.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly pricingPlanService: PricingPlanService,
    private readonly prisma: PrismaService, // Inject PrismaService
    private readonly adminNotificationService: AdminNotificationService, // Inject AdminNotificationService
    private readonly mailService: MailService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createSubscription(params: CreateSubscriptionParams): Promise<UserSubscriptionEntity> {
    // Validate Plan exists
    const plan = await this.pricingPlanService.findOne(params.planId);
    if (!plan) throw new NotFoundException('Pricing Plan not found');

    const now = new Date();
    let endDate: Date | undefined;
    let remainingSessions: number | undefined;
    
    // 🛡️ RE-ENFORCED: Default auto-renew ON except for instant sessions
    const autoRenew = params.autoRenew !== undefined ? params.autoRenew : !plan.isInstantSession;

    if (plan.isInstantSession) {
      remainingSessions = 0;
      endDate = addDays(now, 1);
    } else {
      if (plan.durationDays) {
        endDate = addDays(now, plan.durationDays);
      }
      if (plan.appointmentLimit) {
        remainingSessions = plan.appointmentLimit;
      }
    }

    const subscriptionToCreate: CreateSubscriptionParams = {
      ...params,
      startDate: params.startDate || now,
      endDate: endDate,
      remainingSessions: remainingSessions,
      status: SubscriptionStatus.PENDING,
      autoRenew: autoRenew,
    };

    return this.subscriptionRepository.create(subscriptionToCreate);
  }

  async findActiveSubscription(userId: string): Promise<UserSubscriptionEntity | null> {
    return this.subscriptionRepository.findActiveByUserId(userId);
  }

  async findByGatewaySubscriptionId(gatewaySubscriptionId: string): Promise<UserSubscriptionEntity | null> {
    return this.subscriptionRepository.findByGatewaySubscriptionId(gatewaySubscriptionId);
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscriptionEntity[]> {
    return this.subscriptionRepository.findByUserId(userId);
  }

  async getUserSubscriptionsWithPlan(userId: string): Promise<UserSubscriptionWithPlan[]> {
    const subscriptionsWithPlan = await this.subscriptionRepository.findByUserIdWithPlan(userId);
    return subscriptionsWithPlan.map(sub => {
      const userSubscription = SubscriptionMapper.toDomain(sub);
      const pricingPlan = PricingPlanMapper.toDomain(sub.pricingPlan);
      (userSubscription as UserSubscriptionWithPlan).pricingPlan = pricingPlan;
      return userSubscription as UserSubscriptionWithPlan;
    });
  }

  async getSubscriptionById(id: string): Promise<UserSubscriptionWithPlan> {
    const subscriptionWithPlan = await this.subscriptionRepository.findByIdWithPlan(id);
    if (!subscriptionWithPlan) throw new NotFoundException('Subscription not found');

    // subscriptionWithPlan is now (PrismaSubscription & { pricingPlan: PrismaPricingPlan })
    const userSubscription = SubscriptionMapper.toDomain(subscriptionWithPlan); // Pass the combined object
    const pricingPlan = PricingPlanMapper.toDomain(subscriptionWithPlan.pricingPlan);

    // Manually attach the pricing plan to the user subscription entity for convenience
    (userSubscription as UserSubscriptionWithPlan).pricingPlan = pricingPlan;

    return userSubscription as UserSubscriptionWithPlan;
  }

  async extendSubscription(id: string, months: number): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(id);
    const newEndDate = new Date(sub.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);

    return this.subscriptionRepository.update(id, { endDate: newEndDate });
  }

  async cancelSubscription(id: string): Promise<UserSubscriptionEntity> {
      // 🛡️ RE-ENFORCED: Cancellation now only stops auto-renewal.
      // The subscription remains ACTIVE until the Cron Job expires it based on endDate.
      return this.toggleAutoRenew(id, false);
  }

  async toggleAutoRenew(id: string, autoRenew: boolean): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(id);
    if (!sub) throw new NotFoundException('Subscription not found');

    const updated = await this.subscriptionRepository.update(id, { autoRenew });

    // 📧 Notify User on Auto-Renewal Status Change
    try {
        const user = await this.userRepository.findById(sub.userId);
        if (user) {
            await this.mailService.sendAutoRenewalStatusEmail(
                user.email,
                sub.pricingPlan?.name || 'Subscription Plan',
                autoRenew
            );
        }
    } catch (e) {
        console.error(`Failed to notify user on auto-renewal change for sub: ${id}`, e);
    }

    return updated;
  }

  // Add a public update method
  async update(id: string, params: UpdateSubscriptionParams): Promise<UserSubscriptionEntity> {
    return this.subscriptionRepository.update(id, params);
  }

  async activateSubscription(id: string, startDate: Date, endDate: Date): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(id);
    if (!sub) throw new NotFoundException('Subscription not found');

    const plan = sub.pricingPlan;
    const remainingSessions = plan.appointmentLimit !== undefined && plan.appointmentLimit !== null ? plan.appointmentLimit : undefined;

    const updatedSubscription = await this.subscriptionRepository.update(id, {
        status: SubscriptionStatus.ACTIVE,
        startDate: startDate, // 🛡️ Ensure start date is updated to payment time
        endDate: endDate,
        remainingSessions: remainingSessions,
    });

    // Update the user's currentPricingPlanId
    await this.prisma.user.update({
        where: { id: sub.userId },
        data: { currentPricingPlanId: sub.planId },
    });

    return updatedSubscription;
  }

  async decrementRemainingSessions(subscriptionId: string): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(subscriptionId);
    if (sub.remainingSessions !== null && sub.remainingSessions > 0) {
      const updatedSessions = sub.remainingSessions - 1;
      const updateParams = { remainingSessions: updatedSessions };

      if (updatedSessions === 0) {
        updateParams['status'] = SubscriptionStatus.EXPIRED;
      }
      return this.subscriptionRepository.update(subscriptionId, updateParams);
    }
    
    if (sub.remainingSessions === 0) {
      throw new BadRequestException('No remaining sessions available.');
    }
    // If remainingSessions is null, no change needed, or throw error if unexpected
    return sub;
  }

  async endInstantSession(subscriptionId: string): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(subscriptionId);
    return this.subscriptionRepository.update(subscriptionId, {
      status: SubscriptionStatus.EXPIRED,
      remainingSessions: 0,
    });
  }

  async updateRemainingSessions(subscriptionId: string, sessions: number): Promise<UserSubscriptionEntity> {
    const sub = await this.getSubscriptionById(subscriptionId);
    if (!sub) throw new NotFoundException('Subscription not found');

    return this.subscriptionRepository.update(subscriptionId, {
      remainingSessions: sessions,
      // If sessions are granted, reactivate if it was expired
      status: sessions > 0 ? SubscriptionStatus.ACTIVE : sub.status,
    });
  }

  async grantSessionsToUser(userId: string, sessions: number): Promise<UserSubscriptionEntity> {
    // 1. Check for latest subscription
    const subscriptions = await this.getUserSubscriptions(userId);
    
    if (subscriptions.length > 0) {
      // Sort to find the latest (highest createdAt or by date)
      const latestSub = subscriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      return this.updateRemainingSessions(latestSub.id, sessions);
    }

    // 2. If no subscription exists, find a default plan to link them to
    // We'll look for a "Starter" plan or just pick the first non-instant plan
    const plans = await this.pricingPlanService.findAll();
    const defaultPlan = plans.find(p => p.type === 'STANDARD' || p.name.includes('Starter')) || plans[0];

    if (!defaultPlan) {
      throw new BadRequestException('No suitable pricing plan found to grant sessions.');
    }

    // 3. Create a new active subscription
    const now = new Date();
    const endDate = addDays(now, 30); // Default 30 days for granted sessions

    const sub = await this.subscriptionRepository.create({
      userId,
      planId: defaultPlan.id,
      startDate: now,
      endDate: endDate,
      remainingSessions: sessions,
      status: SubscriptionStatus.ACTIVE,
      autoRenew: false,
    });

    // Update user's current plan
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentPricingPlanId: defaultPlan.id },
    });

    // 📧 Notify Admins (Email disabled per user request)
    await this.adminNotificationService.notify(
      'SUBSCRIPTION',
      'Manual Sessions Granted',
      `<p>Manual sessions have been granted to a user.</p>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Sessions:</strong> ${sessions}</p>`,
       false // sendEmail = false
    );

    return sub;
  }

  async adminGrantSubscription(params: GrantSubscriptionParams): Promise<UserSubscriptionEntity> {
    const { userId, planId } = params;
    // 1. Validate Plan exists
    const plan = await this.pricingPlanService.findOne(planId);
    if (!plan) throw new NotFoundException('Pricing Plan not found');

    // 2. Determine endDate and sessions
    const now = new Date();
    let endDate: Date | undefined;
    let remainingSessions: number | undefined;

    if (plan.isInstantSession) {
      remainingSessions = 0;
      endDate = addDays(now, 1);
    } else {
      if (plan.durationDays) {
        endDate = addDays(now, plan.durationDays);
      }
      if (plan.appointmentLimit) {
        remainingSessions = plan.appointmentLimit;
      }
    }

    // 3. Create active subscription
    const sub = await this.subscriptionRepository.create({
      userId,
      planId,
      startDate: now,
      endDate: endDate,
      remainingSessions: remainingSessions,
      status: SubscriptionStatus.ACTIVE,
      autoRenew: !plan.isInstantSession, // Default auto-renew ON for granted standard plans
    });

    // 4. Update the user's currentPricingPlanId
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentPricingPlanId: planId },
    });

    // 📧 Notify Admins (Email disabled per user request)
    await this.adminNotificationService.notify(
      'SUBSCRIPTION',
      'New Subscription Granted',
      `<p>A new subscription plan has been manually granted to a user by an admin.</p>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Plan ID:</strong> ${planId}</p>
       <p><strong>Plan Name:</strong> ${plan.name}</p>`,
       false // sendEmail = false
    );

    return sub;
  }

  async getUsersWithSubscriptionStatus(status: 'ACTIVE' | 'EXPIRED'): Promise<any[]> {
    const users = await this.subscriptionRepository.findUsersByStatus(status);
    return users.map(user => {
      // We can use UserMapper to return a domain entity or a secure response
      const userEntity = UserMapper.toDomain(user);
      return UserMapper.toSecureUserResponseDto(userEntity);
    });
  }
}
