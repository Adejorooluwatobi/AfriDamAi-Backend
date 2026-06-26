import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionExpiry() {
    this.logger.log('Checking for expired subscriptions...');

    const now = new Date();

    // Find active subscriptions that have expired (endDate passed)
    const expiredSubscriptions = await this.prisma.userSubscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now,
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    // Find active subscriptions with no remaining sessions (appointment limit reached)
    const noSessionsSubscriptions = await this.prisma.userSubscription.findMany({
      where: {
        status: 'ACTIVE',
        remainingSessions: 0,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    const allExpiredIds = [
      ...expiredSubscriptions.map(s => s.id),
      ...noSessionsSubscriptions.map(s => s.id)
    ];

    const allExpiredUserIds = [
      ...expiredSubscriptions.map(s => s.userId),
      ...noSessionsSubscriptions.map(s => s.userId)
    ];

    if (allExpiredIds.length > 0) {
      const uniqueUserIds = [...new Set(allExpiredUserIds)];

      // Mark subscriptions as EXPIRED
      const result = await this.prisma.userSubscription.updateMany({
        where: {
          id: {
            in: allExpiredIds,
          },
        },
        data: {
          status: 'EXPIRED',
          autoRenew: false,
        },
      });

      // Set currentPricingPlanId to null for affected users
      await this.prisma.user.updateMany({
        where: {
          id: {
            in: uniqueUserIds,
          },
        },
        data: {
          currentPricingPlanId: null,
        },
      });

      this.logger.log(`Expired ${result.count} subscriptions and updated ${uniqueUserIds.length} users.`);
    } else {
      this.logger.log('No subscriptions expired today.');
    }
  }
}
