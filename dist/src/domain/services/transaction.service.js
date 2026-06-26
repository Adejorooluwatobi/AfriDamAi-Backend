"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const TransactionRepo = __importStar(require("../repositories/transaction.repository.interface"));
const AppointmentRepo = __importStar(require("../repositories/appointment.repository.interface"));
const transaction_entity_1 = require("../entities/transaction.entity");
const paymentGatewayInterface = __importStar(require("../interfaces/payment-gateway.interface"));
const order_service_1 = require("./order.service");
const order_entity_1 = require("../entities/order.entity");
const invoice_service_1 = require("./invoice.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const pricing_plan_service_1 = require("./pricing-plan.service");
const subscription_service_1 = require("./subscription.service");
const admin_service_1 = require("./admin.service");
const notification_service_1 = require("./notification.service");
const wallet_service_1 = require("./wallet.service");
const wallet_transaction_service_1 = require("./wallet-transaction.service");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const admin_notification_service_1 = require("./admin-notification.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(transactionRepository, paymentGateway, appointmentRepository, userRepository, orderService, invoiceService, pricingPlanService, subscriptionService, adminService, notificationService, walletService, walletTransactionService, prisma, orderRepository, productRepository, adminNotificationService, mailService) {
        this.transactionRepository = transactionRepository;
        this.paymentGateway = paymentGateway;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.invoiceService = invoiceService;
        this.pricingPlanService = pricingPlanService;
        this.subscriptionService = subscriptionService;
        this.adminService = adminService;
        this.notificationService = notificationService;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.prisma = prisma;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.adminNotificationService = adminNotificationService;
        this.mailService = mailService;
        this.logger = new common_1.Logger(TransactionService_1.name);
    }
    async initiateTransaction(userId, createTransaction) {
        let amount = createTransaction.amount;
        let metadata = {};
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userEmail = user.email;
        if (createTransaction.orderId) {
            const order = await this.orderRepository.findById(createTransaction.orderId);
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.userId !== userId)
                throw new common_1.NotFoundException('Order ownership mismatch');
            if (order.status !== order_entity_1.OrderStatus.PENDING)
                throw new common_1.BadRequestException('Order already processed');
            amount = order.totalAmount;
            metadata = { orderId: order.id, userId };
        }
        else if (createTransaction.appointmentId) {
            metadata = { appointmentId: createTransaction.appointmentId, userId };
            amount = createTransaction.amount;
        }
        else if (createTransaction.subscriptionId) {
            const subscription = await this.subscriptionService.getSubscriptionById(createTransaction.subscriptionId);
            if (!subscription)
                throw new common_1.NotFoundException('Subscription not found');
            if (subscription.userId !== userId)
                throw new common_1.BadRequestException('Subscription ownership mismatch');
            if (subscription.status === 'ACTIVE')
                throw new common_1.BadRequestException('Subscription is already ACTIVE');
            const plan = await this.pricingPlanService.findOne(subscription.planId);
            if (!plan)
                throw new common_1.NotFoundException('Associated Pricing Plan not found');
            amount = plan.price;
            metadata = { subscriptionId: subscription.id, userId };
        }
        else if (createTransaction.pricingPlanId) {
            const plan = await this.pricingPlanService.findOne(createTransaction.pricingPlanId);
            amount = plan.price;
            metadata = { pricingPlanId: plan.id, userId };
        }
        const planCode = metadata.subscriptionId ?
            (await this.subscriptionService.getSubscriptionById(metadata.subscriptionId))?.pricingPlan?.paystackPlanCode :
            metadata.pricingPlanId ? (await this.pricingPlanService.findOne(metadata.pricingPlanId))?.paystackPlanCode : undefined;
        const { reference, authorizationUrl } = await this.paymentGateway.initializePayment(userEmail, amount, metadata, planCode);
        const transaction = await this.transactionRepository.create({
            ...createTransaction,
            userId,
            amount,
            status: transaction_entity_1.TransactionStatus.PENDING,
            gatewayTransactionId: reference,
        });
        return { transaction, authorizationUrl };
    }
    async fulfillTransaction(transaction) {
        this.logger.log(`Fulfilling Transaction: ${transaction.id} - SubID: ${transaction.subscriptionId} - PlanID: ${transaction.pricingPlanId}`);
        await this.notifyAdminsOnTransactionCompletion(transaction);
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        if (superAdmins.length === 0) {
            throw new common_1.InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
        }
        const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
        let organizationWallet;
        try {
            organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, client_1.WalletOwnerType.ORGANIZATION);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                organizationWallet = await this.walletService.createWallet({
                    ownerId: ORGANIZATION_ADMIN_ID,
                    ownerType: client_1.WalletOwnerType.ORGANIZATION,
                    initialBalance: 0,
                });
                this.logger.log(`Created Organization Wallet: ${organizationWallet.id}`);
            }
            else {
                throw error;
            }
        }
        const user = await this.userRepository.findById(transaction.userId);
        if (!user) {
            this.logger.error(`User ${transaction.userId} not found during transaction fulfillment`);
            throw new common_1.NotFoundException(`User ${transaction.userId} not found`);
        }
        const existingCredits = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(transaction.id, client_1.WalletRelatedEntityType.TRANSACTION);
        let isAlreadyCredited = false;
        if (existingCredits && existingCredits.length > 0) {
            const creditTx = existingCredits.find(tx => tx.walletId === organizationWallet.id && tx.type === client_1.WalletTransactionType.CREDIT);
            if (creditTx) {
                isAlreadyCredited = true;
                this.logger.log(`Transaction ${transaction.id} already credited to Organization Wallet. Skipping...`);
            }
        }
        if (!isAlreadyCredited) {
            await this.walletService.creditWallet(organizationWallet.id, transaction.amount);
            await this.walletTransactionService.createWalletTransaction({
                walletId: organizationWallet.id,
                type: client_1.WalletTransactionType.CREDIT,
                amount: transaction.amount,
                description: `Payment from ${user.firstName} ${user.lastName} (${user.email}) via ${transaction.gateway} for ${transaction.orderId ? 'Order' : transaction.appointmentId ? 'Appointment' : 'Subscription'}`,
                relatedEntityId: transaction.id,
                relatedEntityType: client_1.WalletRelatedEntityType.TRANSACTION,
            });
            this.logger.log(`Organization Wallet ${organizationWallet.id} credited with ${transaction.amount} from transaction ${transaction.id}`);
        }
        if (transaction.orderId) {
            this.logger.log(`Fulfilling Order: ${transaction.orderId}`);
            await this.orderService.updateOrderStatus(transaction.orderId, { status: order_entity_1.OrderStatus.CONFIRMED });
            const order = await this.orderRepository.findById(transaction.orderId);
            if (!order) {
                throw new common_1.NotFoundException(`Order ${transaction.orderId} not found during fulfillment.`);
            }
            const existingPayouts = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(order.id, client_1.WalletRelatedEntityType.ORDER);
            let isOrderAlreadyPaidOut = false;
            if (existingPayouts && existingPayouts.length > 0) {
                const payoutTx = existingPayouts.find(tx => tx.walletId === organizationWallet.id && tx.type === client_1.WalletTransactionType.DEBIT);
                if (payoutTx) {
                    isOrderAlreadyPaidOut = true;
                    this.logger.log(`Order ${order.id} already paid out to vendors. Skipping duplicate payout...`);
                }
            }
            if (!isOrderAlreadyPaidOut) {
                const vendorPayouts = {};
                if (order.items && order.items.length > 0) {
                    for (const item of order.items) {
                        if (item.product && item.product.vendorId) {
                            vendorPayouts[item.product.vendorId] = (vendorPayouts[item.product.vendorId] || 0) + (item.price * item.quantity);
                        }
                        else {
                            const product = await this.productRepository.findById(item.productId);
                            if (product && product.vendorId) {
                                vendorPayouts[product.vendorId] = (vendorPayouts[product.vendorId] || 0) + (item.price * item.quantity);
                            }
                        }
                    }
                }
                for (const vendorId in vendorPayouts) {
                    const totalVendorSales = vendorPayouts[vendorId];
                    const payoutAmount = totalVendorSales * 0.8;
                    let vendorWallet;
                    try {
                        vendorWallet = await this.walletService.getWalletByOwner(vendorId, client_1.WalletOwnerType.VENDOR);
                    }
                    catch (error) {
                        if (error instanceof common_1.NotFoundException) {
                            vendorWallet = await this.walletService.createWallet({
                                ownerId: vendorId,
                                ownerType: client_1.WalletOwnerType.VENDOR,
                                initialBalance: 0,
                            });
                            this.logger.log(`Created Vendor Wallet: ${vendorWallet.id} for Vendor ${vendorId}`);
                        }
                        else {
                            throw error;
                        }
                    }
                    await this.walletService.debitWallet(organizationWallet.id, payoutAmount);
                    await this.walletTransactionService.createWalletTransaction({
                        walletId: organizationWallet.id,
                        type: client_1.WalletTransactionType.DEBIT,
                        amount: payoutAmount,
                        description: `Payout to Vendor ${vendorId} (80% share) for Order ${order.id}`,
                        relatedEntityId: order.id,
                        relatedEntityType: client_1.WalletRelatedEntityType.ORDER,
                    });
                    this.logger.log(`Organization Wallet ${organizationWallet.id} debited ${payoutAmount} (80%) for Vendor ${vendorId}`);
                    await this.walletService.creditWallet(vendorWallet.id, payoutAmount);
                    await this.walletTransactionService.createWalletTransaction({
                        walletId: vendorWallet.id,
                        type: client_1.WalletTransactionType.CREDIT,
                        amount: payoutAmount,
                        description: `Sales Earnings (80% share) from Order #${order.id} (Customer: ${user.firstName} ${user.lastName})`,
                        relatedEntityId: order.id,
                        relatedEntityType: client_1.WalletRelatedEntityType.ORDER,
                    });
                    this.logger.log(`Vendor Wallet ${vendorWallet.id} credited ${payoutAmount} (80%) for Order ${order.id}`);
                }
            }
            const existingInvoice = await this.invoiceService.findInvoiceByOrderId(order.id);
            if (!existingInvoice) {
                await this.invoiceService.createInvoice({
                    userId: order.userId,
                    orderId: order.id,
                    invoiceNumber: `INV-${Date.now()}`,
                    totalAmount: order.totalAmount,
                    netAmount: order.totalAmount,
                    status: 'PAID',
                    issueDate: new Date().toISOString(),
                    items: (order.items || []).map(item => ({
                        productId: item.productId,
                        description: item.product?.name || `Product ${item.productId}`,
                        quantity: item.quantity,
                        unitPrice: item.price,
                        totalPrice: item.price * item.quantity
                    }))
                });
            }
            else {
                this.logger.log(`Invoice already exists for Order ${order.id}. Skipping creation...`);
            }
            await this.notifyAdminsAndVendorsOnOrderCompletion(order);
            try {
                const userForEmail = await this.userRepository.findById(order.userId);
                if (userForEmail && order.items) {
                    await this.mailService.sendOrderPurchaseEmail(userForEmail.email, order, 'USER');
                    const vendorMap = new Map();
                    order.items.forEach(item => {
                        if (item.product?.vendor?.email) {
                            const email = item.product.vendor.email;
                            if (!vendorMap.has(email)) {
                                vendorMap.set(email, []);
                            }
                            vendorMap.get(email).push(item);
                        }
                    });
                    for (const [vendorEmail, items] of vendorMap.entries()) {
                        const vendorOrder = { ...order, items };
                        await this.mailService.sendOrderPurchaseEmail(vendorEmail, vendorOrder, 'VENDOR');
                        this.logger.log(`Vendor confirmation email sent to ${vendorEmail} with ${items.length} items.`);
                    }
                }
            }
            catch (e) {
                this.logger.error(`Failed to send order confirmation emails for order ${order.id}`, e);
            }
        }
        if (transaction.appointmentId) {
            this.logger.log(`Fulfilling Appointment: ${transaction.appointmentId}`);
            await this.appointmentRepository.update(transaction.appointmentId, {
                status: client_1.AppointmentStatus.CONFIRMED
            });
        }
        if (transaction.subscriptionId) {
            const sub = await this.subscriptionService.getSubscriptionById(transaction.subscriptionId);
            const plan = await this.pricingPlanService.findOne(sub.planId);
            const duration = plan?.durationDays || 30;
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + duration);
            this.logger.log(`Activating Pending Subscription: ${transaction.subscriptionId} (Plan: ${plan?.name}, Duration: ${duration} days)`);
            await this.subscriptionService.activateSubscription(transaction.subscriptionId, startDate, endDate);
            try {
                const subUser = await this.userRepository.findById(transaction.userId);
                if (subUser) {
                    await this.mailService.sendSubscriptionStatusEmail(subUser.email, plan?.name || 'Subscription Plan', 'SUCCESS');
                }
            }
            catch (e) {
                this.logger.error(`Failed to send subscription success email for subscription ${transaction.subscriptionId}`, e);
            }
        }
        else if (transaction.pricingPlanId) {
            const plan = await this.pricingPlanService.findOne(transaction.pricingPlanId);
            const duration = plan?.durationDays || 30;
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + duration);
            this.logger.log(`Creating New Subscription from Plan Payment: ${transaction.pricingPlanId} (Plan: ${plan?.name}, Duration: ${duration} days)`);
            await this.subscriptionService.createSubscription({
                userId: transaction.userId,
                planId: transaction.pricingPlanId,
                startDate: startDate,
                endDate: endDate,
                status: 'ACTIVE',
                autoRenew: true
            });
        }
        else {
            this.logger.warn(`Transaction fulfilled but no fulfillment path found (Order/Appointment/Sub/Plan missing)`);
        }
    }
    async notifyAdminsOnTransactionCompletion(transaction) {
        const financeAdmins = await this.adminService.findByRole(client_1.AdminType.FINANCE_ADMIN);
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        const adminsToNotify = [...financeAdmins, ...superAdmins];
        for (const admin of adminsToNotify) {
            const title = 'Transaction Successful';
            const message = `Transaction with ID ${transaction.id} for amount ${transaction.amount} was successful.`;
            await this.notificationService.createNotification({
                adminId: admin.id,
                title,
                message,
            });
        }
        await this.adminNotificationService.notify('FINANCE', 'Transaction Successful', `<p>A transaction has been completed successfully.</p>
       <p><strong>Transaction ID:</strong> ${transaction.id}</p>
       <p><strong>Amount:</strong> ₦${transaction.amount}</p>
       <p><strong>Gateway:</strong> ${transaction.gateway}</p>`, false);
    }
    async notifyAdminsAndVendorsOnOrderCompletion(order) {
        const vendorManagers = await this.adminService.findByRole(client_1.AdminType.VENDOR_MANAGER);
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        const adminsToNotify = [...vendorManagers, ...superAdmins];
        for (const admin of adminsToNotify) {
            const title = 'New Product Purchase';
            const message = `A new order with ID ${order.id} for a total of ${order.totalAmount} has been placed.`;
            await this.notificationService.createNotification({
                adminId: admin.id,
                title,
                message,
            });
        }
        const vendorItems = {};
        if (order.items) {
            for (const item of order.items) {
                if (item.product && item.product.vendorId) {
                    const vendorId = item.product.vendorId;
                    if (!vendorItems[vendorId]) {
                        vendorItems[vendorId] = [];
                    }
                    vendorItems[vendorId].push(item);
                }
            }
        }
        for (const vendorId in vendorItems) {
            const items = vendorItems[vendorId];
            const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const title = 'New Sale';
            const message = `You have a new sale for ${items.length} item(s) with a total of ${totalAmount}.`;
            await this.notificationService.createNotification({
                vendorId,
                title,
                message,
            });
        }
        await this.adminNotificationService.notify('SALES', 'New Order Placed', `<p>A new product order has been confirmed.</p>
       <p><strong>Order ID:</strong> ${order.id}</p>
       <p><strong>Total Amount:</strong> ₦${order.totalAmount}</p>`, false);
    }
    async handlePaystackWebhook(payload, signature) {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
        if (hash !== signature) {
            this.logger.error('Invalid Webhook Signature detected');
            await this.prisma.webhookLog.create({
                data: {
                    gateway: 'PAYSTACK',
                    event: payload.event || 'unknown',
                    payload: payload,
                    status: 'INVALID_SIGNATURE'
                }
            });
            throw new common_1.BadRequestException('Invalid signature');
        }
        const event = payload.event;
        const data = payload.data;
        await this.prisma.webhookLog.create({
            data: {
                gateway: 'PAYSTACK',
                event: event,
                payload: payload,
                status: 'RECEIVED'
            }
        });
        switch (event) {
            case 'charge.success':
                this.logger.log(`Payment Success Webhook for ref: ${data.reference}`);
                const existingTx = await this.transactionRepository.findByGatewayTransactionId(data.reference);
                if (!existingTx && data.subscription) {
                    this.logger.log(`Recurring charge detected for subscription: ${data.subscription}`);
                    const subscription = await this.subscriptionService.findByGatewaySubscriptionId(data.subscription);
                    if (subscription) {
                        const newTx = await this.transactionRepository.create({
                            userId: subscription.userId,
                            amount: data.amount / 100,
                            gateway: 'PAYSTACK',
                            gatewayTransactionId: data.reference,
                            status: transaction_entity_1.TransactionStatus.COMPLETED,
                            subscriptionId: subscription.id,
                        });
                        await this.fulfillTransaction(newTx);
                        return { status: 'renewal_processed' };
                    }
                }
                return this.verifyTransactionByReference(data.reference);
            case 'subscription.create':
                this.logger.log(`Subscription Created Webhook for SUB: ${data.subscription_code}`);
                const subId = data.metadata?.subscriptionId;
                if (subId) {
                    await this.subscriptionService.update(subId, {
                        gatewaySubscriptionId: data.subscription_code,
                        autoRenew: true
                    });
                }
                return { status: 'subscription_linked' };
            case 'subscription.disable':
                this.logger.log(`Subscription Disabled Webhook for SUB: ${data.subscription_code}`);
                const sub = await this.subscriptionService.findByGatewaySubscriptionId(data.subscription_code);
                if (sub) {
                    await this.subscriptionService.update(sub.id, {
                        autoRenew: false,
                        status: 'CANCELLED'
                    });
                }
                return { status: 'subscription_disabled' };
            default:
                this.logger.log(`Ignored Paystack event: ${event}`);
                return { status: 'event_ignored' };
        }
    }
    async verifyTransactionByReference(reference) {
        const transaction = await this.transactionRepository.findByGatewayTransactionId(reference);
        if (!transaction)
            throw new common_1.NotFoundException('Transaction reference not found');
        if (transaction.status === transaction_entity_1.TransactionStatus.COMPLETED) {
            await this.fulfillTransaction(transaction);
            return transaction;
        }
        return this.processVerification(transaction);
    }
    async verifyTransactionById(transactionId) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status === transaction_entity_1.TransactionStatus.COMPLETED) {
            await this.fulfillTransaction(transaction);
            return transaction;
        }
        return this.processVerification(transaction);
    }
    async processVerification(transaction) {
        const reference = transaction.gatewayTransactionId;
        const verificationResult = await this.paymentGateway.verifyPayment(reference);
        if (verificationResult.status === 'COMPLETED') {
            const updatedTransaction = await this.transactionRepository.update(transaction.id, {
                status: transaction_entity_1.TransactionStatus.COMPLETED,
            });
            await this.fulfillTransaction(updatedTransaction);
            return updatedTransaction;
        }
        else if (verificationResult.status === 'PENDING') {
            throw new common_1.BadRequestException('Payment is still being processed. Please try again later.');
        }
        else {
            await this.transactionRepository.update(transaction.id, { status: transaction_entity_1.TransactionStatus.FAILED });
            if (transaction.subscriptionId || transaction.pricingPlanId) {
                try {
                    const user = await this.userRepository.findById(transaction.userId);
                    if (user) {
                        let planName = 'Subscription Plan';
                        if (transaction.subscriptionId) {
                            const sub = await this.subscriptionService.getSubscriptionById(transaction.subscriptionId);
                            planName = sub?.pricingPlan?.name || 'Subscription Plan';
                        }
                        else if (transaction.pricingPlanId) {
                            const plan = await this.pricingPlanService.findOne(transaction.pricingPlanId);
                            planName = plan?.name || 'Subscription Plan';
                        }
                        await this.mailService.sendSubscriptionStatusEmail(user.email, planName, 'FAILED');
                    }
                }
                catch (e) {
                    this.logger.error(`Failed to send subscription failure email for transaction ${transaction.id}`, e);
                }
            }
            if (transaction.orderId) {
                this.logger.log(`Payment failed for Order: ${transaction.orderId}. Restoring stock and cancelling order.`);
                await this.orderService.updateOrderStatus(transaction.orderId, { status: order_entity_1.OrderStatus.CANCELLED });
                await this.orderService.restoreStock(transaction.orderId);
            }
            throw new common_1.BadRequestException('Payment was not successful');
        }
    }
    async getAllTransaction() {
        return await this.transactionRepository.get();
    }
    async getTransactionById(id) {
        let transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            transaction = await this.transactionRepository.findByGatewayTransactionId(id);
        }
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        return transaction;
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __param(1, (0, common_1.Inject)('IPaymentGateway')),
    __param(2, (0, common_1.Inject)('IAppointmentRepository')),
    __param(3, (0, common_1.Inject)('IUserRepository')),
    __param(13, (0, common_1.Inject)('IOrderRepository')),
    __param(14, (0, common_1.Inject)('IProductRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, order_service_1.OrderService,
        invoice_service_1.InvoiceService,
        pricing_plan_service_1.PricingPlanService,
        subscription_service_1.SubscriptionService,
        admin_service_1.AdminService,
        notification_service_1.NotificationService,
        wallet_service_1.WalletService,
        wallet_transaction_service_1.WalletTransactionService,
        prisma_service_1.PrismaService, Object, Object, admin_notification_service_1.AdminNotificationService,
        mail_service_1.MailService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map