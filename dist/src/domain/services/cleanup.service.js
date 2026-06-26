"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const order_service_1 = require("./order.service");
const transaction_service_1 = require("./transaction.service");
const order_entity_1 = require("../entities/order.entity");
const transaction_entity_1 = require("../entities/transaction.entity");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let CleanupService = CleanupService_1 = class CleanupService {
    constructor(orderRepository, transactionRepository, orderService, transactionService, prisma) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.orderService = orderService;
        this.transactionService = transactionService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(CleanupService_1.name);
    }
    async handleInactivityCleanup() {
        this.logger.log('Running Inactivity Cleanup Job...');
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - 1);
        try {
            const updatedUsers = await this.prisma.user.updateMany({
                where: {
                    isActive: true,
                    lastLoginAt: {
                        lt: threshold
                    }
                },
                data: { isActive: false }
            });
            if (updatedUsers.count > 0)
                this.logger.log(`Marked ${updatedUsers.count} users as inactive due to inactivity.`);
            const updatedVendors = await this.prisma.vendor.updateMany({
                where: {
                    isActive: true,
                    lastLoginAt: {
                        lt: threshold
                    }
                },
                data: { isActive: false }
            });
            if (updatedVendors.count > 0)
                this.logger.log(`Marked ${updatedVendors.count} vendors as inactive due to inactivity.`);
            const updatedSpecialists = await this.prisma.specialist.updateMany({
                where: {
                    isActive: true,
                    lastLoginAt: {
                        lt: threshold
                    }
                },
                data: { isActive: false }
            });
            if (updatedSpecialists.count > 0)
                this.logger.log(`Marked ${updatedSpecialists.count} specialists as inactive due to inactivity.`);
        }
        catch (error) {
            this.logger.error(`Failed to run inactivity cleanup: ${error.message}`);
        }
    }
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
                await this.orderService.updateOrderStatus(order.id, { status: order_entity_1.OrderStatus.CANCELLED });
                await this.orderService.restoreStock(order.id);
                this.logger.log(`Cancelled stale order: ${order.id}`);
            }
            catch (error) {
                this.logger.error(`Failed to cancel stale order ${order.id}: ${error.message}`);
            }
        }
    }
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
                await this.transactionRepository.update(tx.id, { status: transaction_entity_1.TransactionStatus.FAILED });
                this.logger.log(`Failed stale transaction: ${tx.id}`);
                if (tx.orderId) {
                    await this.orderService.updateOrderStatus(tx.orderId, { status: order_entity_1.OrderStatus.CANCELLED });
                    await this.orderService.restoreStock(tx.orderId);
                    this.logger.log(`Cancelled order ${tx.orderId} due to failed stale transaction ${tx.id}`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to process stale transaction ${tx.id}: ${error.message}`);
            }
        }
    }
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
            }
            else {
                this.logger.log('No stale pending subscriptions found.');
            }
        }
        catch (error) {
            this.logger.error(`Failed to clean up pending subscriptions: ${error.message}`);
        }
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleInactivityCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleOrderCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleTransactionCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handlePendingSubscriptionCleanup", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IOrderRepository')),
    __param(1, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object, Object, order_service_1.OrderService,
        transaction_service_1.TransactionService,
        prisma_service_1.PrismaService])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map