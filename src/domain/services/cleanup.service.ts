import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from './order.service';
import { TransactionService } from './transaction.service';
import { OrderRepositoryInterface } from '../repositories/order.repository.interface';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { OrderStatus } from '../entities/order.entity';
import { TransactionStatus } from '../entities/transaction.entity';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    private readonly orderService: OrderService,
    private readonly transactionService: TransactionService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleInactivityCleanup() {
    this.logger.log('Running Inactivity Cleanup Job...');
    const threshold = new Date();
    threshold.setHours(threshold.getHours() - 1);

    try {
      // 1. Users
      const updatedUsers = await this.prisma.user.updateMany({
        where: {
          isActive: true,
          lastLoginAt: {
            lt: threshold
          }
        },
        data: { isActive: false }
      });
      if (updatedUsers.count > 0) this.logger.log(`Marked ${updatedUsers.count} users as inactive due to inactivity.`);

      // 2. Vendors
      const updatedVendors = await this.prisma.vendor.updateMany({
        where: {
          isActive: true,
          lastLoginAt: {
            lt: threshold
          }
        },
        data: { isActive: false }
      });
      if (updatedVendors.count > 0) this.logger.log(`Marked ${updatedVendors.count} vendors as inactive due to inactivity.`);

      // 3. Specialists
      const updatedSpecialists = await this.prisma.specialist.updateMany({
        where: {
          isActive: true,
          lastLoginAt: {
            lt: threshold
          }
        },
        data: { isActive: false }
      });
      if (updatedSpecialists.count > 0) this.logger.log(`Marked ${updatedSpecialists.count} specialists as inactive due to inactivity.`);

    } catch (error) {
      this.logger.error(`Failed to run inactivity cleanup: ${error.message}`);
    }
  }

  /**
   * Every hour, cancel orders that have been pending for more than 24 hours.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleOrderCleanup() {
    this.logger.log('Running Order Cleanup Job...');
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const staleOrders = await this.orderRepository.findPendingOrdersOlderThan(twentyFourHoursAgo);
    
    if (staleOrders.length === 0) {
      this.logger.log('No stale pending orders found.');
      return;
    }

    this.logger.log(`Found ${staleOrders.length} stale pending orders. Cancelling...`);

    for (const order of staleOrders) {
      try {
        await this.orderService.updateOrderStatus(order.id, { status: OrderStatus.CANCELLED });
        await this.orderService.restoreStock(order.id);
        this.logger.log(`Cancelled stale order: ${order.id}`);
      } catch (error) {
        this.logger.error(`Failed to cancel stale order ${order.id}: ${error.message}`);
      }
    }
  }

  /**
   * Every 10 minutes, fail transactions that have been pending for more than 30 minutes.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleTransactionCleanup() {
    this.logger.log('Running Transaction Cleanup Job...');
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const staleTransactions = await this.transactionRepository.findPendingTransactionsOlderThan(thirtyMinutesAgo);

    if (staleTransactions.length === 0) {
      this.logger.log('No stale pending transactions found.');
      return;
    }

    this.logger.log(`Found ${staleTransactions.length} stale pending transactions. Failing...`);

    for (const tx of staleTransactions) {
      try {
        await this.transactionRepository.update(tx.id, { status: TransactionStatus.FAILED });
        this.logger.log(`Failed stale transaction: ${tx.id}`);
        
        // If it was an order transaction, cancel the order too
        if (tx.orderId) {
          await this.orderService.updateOrderStatus(tx.orderId, { status: OrderStatus.CANCELLED });
          await this.orderService.restoreStock(tx.orderId);
          this.logger.log(`Cancelled order ${tx.orderId} due to failed stale transaction ${tx.id}`);
        }
      } catch (error) {
        this.logger.error(`Failed to process stale transaction ${tx.id}: ${error.message}`);
      }
    }
  }

  /**
   * Every 5 minutes, cancel subscriptions that have been pending for more than 15 minutes.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePendingSubscriptionCleanup() {
    this.logger.log('Running Pending Subscription Cleanup Job...');
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    try {
      const updatedSubscriptions = await this.prisma.userSubscription.updateMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: fifteenMinutesAgo,
          },
        },
        data: {
          status: 'CANCELLED',
        },
      });

      if (updatedSubscriptions.count > 0) {
        this.logger.log(`Cancelled ${updatedSubscriptions.count} stale pending subscriptions.`);
      } else {
        this.logger.log('No stale pending subscriptions found.');
      }
    } catch (error) {
      this.logger.error(`Failed to clean up pending subscriptions: ${error.message}`);
    }
  }
}
