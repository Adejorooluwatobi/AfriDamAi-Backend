import { Injectable, BadRequestException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UserSubscriptionWithPlan } from '../types/subscription.types';
import { SubscriptionStatus } from '../entities/subscription.entity';
import { differenceInDays } from 'date-fns';

export interface SubscriptionEligibility {
  eligible: boolean;
  reason?: string;
  subscription?: UserSubscriptionWithPlan;
  daysRemaining?: number;
}

@Injectable()
export class SubscriptionValidationService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async validateSubscriptionForAppointment(userId: string): Promise<SubscriptionEligibility> {
    const allSubscriptions = await this.subscriptionService.getUserSubscriptionsWithPlan(userId);
    const activeSubscriptions = allSubscriptions.filter(sub => sub.status === SubscriptionStatus.ACTIVE && (sub.endDate ? new Date(sub.endDate) > new Date() : true));

    if (activeSubscriptions.length === 0) {
      return {
        eligible: false,
        reason: 'No active subscription found. Please subscribe to a plan first.',
      };
    }

    // 🚀 NEW: Cumulative Session Logic
    let totalRemainingSessions = 0;
    let hasInstantSession = false;
    let latestActiveSubscription: UserSubscriptionWithPlan | null = null;
    let maxEndDate: Date | null = null;

    for (const sub of activeSubscriptions) {
        const plan = sub.pricingPlan;

        if (plan.isInstantSession) {
            hasInstantSession = true;
        } else if (plan.appointmentLimit !== null) {
            totalRemainingSessions += sub.remainingSessions || 0;
        }

        // Keep track of the one that expires last for display purposes
        if (!maxEndDate || (sub.endDate && new Date(sub.endDate) > maxEndDate)) {
            maxEndDate = sub.endDate ? new Date(sub.endDate) : null;
            latestActiveSubscription = sub;
        }
    }

    if (hasInstantSession) {
        return {
            eligible: true,
            subscription: latestActiveSubscription!,
            daysRemaining: this.calculateDaysRemaining(maxEndDate),
        };
    }

    if (totalRemainingSessions <= 0) {
        return {
            eligible: false,
            reason: 'You have no remaining appointment slots across your active subscriptions.',
        };
    }

    return {
      eligible: true,
      subscription: latestActiveSubscription!,
      daysRemaining: this.calculateDaysRemaining(maxEndDate),
    };
  }

  calculateDaysRemaining(endDate: Date | null): number {
    if (!endDate) return 0;
    const now = new Date();
    return differenceInDays(new Date(endDate), now);
  }
}
