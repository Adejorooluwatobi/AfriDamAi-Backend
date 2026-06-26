import { Inject, Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as TransactionRepo from '../repositories/transaction.repository.interface';
import * as AppointmentRepo from '../repositories/appointment.repository.interface';
import { TransactionEntity, TransactionStatus } from '../entities/transaction.entity';
import * as paymentGatewayInterface from '../interfaces/payment-gateway.interface';
import { OrderService } from './order.service';
import { OrderStatus } from '../entities/order.entity';
import { CreateTransactionParams } from 'src/utils/type';
import { InvoiceService } from './invoice.service';
import { AdminType, AppointmentStatus, WalletOwnerType, WalletTransactionType, WalletRelatedEntityType } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository.interface';
import * as crypto from 'crypto';
import { PricingPlanService } from './pricing-plan.service';
import { SubscriptionService } from './subscription.service';
import { AdminService } from './admin.service';
import { NotificationService } from './notification.service';
import { WalletService } from './wallet.service';
import { WalletTransactionService } from './wallet-transaction.service';
import { OrderRepositoryInterface } from '../repositories/order.repository.interface';
import { ProductRepositoryInterface } from '../repositories/product.repository.interface'; // Corrected import
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AdminNotificationService } from './admin-notification.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: TransactionRepo.ITransactionRepository,
    @Inject('IPaymentGateway')
    private readonly paymentGateway: paymentGatewayInterface.PaymentGatewayInterface,
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: AppointmentRepo.IAppointmentRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly orderService: OrderService,
    private readonly invoiceService: InvoiceService,
    private readonly pricingPlanService: PricingPlanService,
    private readonly subscriptionService: SubscriptionService,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService,
    private readonly walletService: WalletService, // Correctly declare as private readonly
    private readonly walletTransactionService: WalletTransactionService, // Correctly declare as private readonly
    private readonly prisma: PrismaService,
    @Inject('IOrderRepository')
    private readonly orderRepository: OrderRepositoryInterface, // Corrected type
    @Inject('IProductRepository') // For fetching product details in fulfillTransaction
    private readonly productRepository: ProductRepositoryInterface, // Corrected type
    private readonly adminNotificationService: AdminNotificationService,
    private readonly mailService: MailService,
  ) {}

  /**
   * 💳 INITIATE TRANSACTION
   */
  async initiateTransaction(
    userId: string,
    createTransaction: CreateTransactionParams,
  ): Promise<{ transaction: TransactionEntity; authorizationUrl: string }> {
    let amount = createTransaction.amount;
    let metadata: any = {};

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const userEmail = user.email;

    if (createTransaction.orderId) {
      // Fetch order with items and product details for validation
      const order = await this.orderRepository.findById(createTransaction.orderId);
      if (!order) throw new NotFoundException('Order not found');
      if (order.userId !== userId) throw new NotFoundException('Order ownership mismatch');
      if (order.status !== OrderStatus.PENDING) throw new BadRequestException('Order already processed');
      
      amount = order.totalAmount;
      metadata = { orderId: order.id, userId };
    } 
    else if (createTransaction.appointmentId) {
      metadata = { appointmentId: createTransaction.appointmentId, userId };
      amount = createTransaction.amount;
    }
    // 🚀 NEW PENDING SUBSCRIPTION LOGIC
    else if (createTransaction.subscriptionId) {
      const subscription = await this.subscriptionService.getSubscriptionById(createTransaction.subscriptionId);
      if (!subscription) throw new NotFoundException('Subscription not found');
      if (subscription.userId !== userId) throw new BadRequestException('Subscription ownership mismatch');
      // Verify subscription is strictly PENDING or EXPIRED (for renewal)
      if (subscription.status === 'ACTIVE') throw new BadRequestException('Subscription is already ACTIVE');

      // Fetch Plan Price dynamically
      const plan = await this.pricingPlanService.findOne(subscription.planId);
      if (!plan) throw new NotFoundException('Associated Pricing Plan not found');

      amount = plan.price;
      metadata = { subscriptionId: subscription.id, userId };
    }
    // ⚠️ Legacy Logic (Optional fall-back if user passes just planId)
    else if (createTransaction.pricingPlanId) {
       const plan = await this.pricingPlanService.findOne(createTransaction.pricingPlanId);
       amount = plan.price;
       metadata = { pricingPlanId: plan.id, userId };
    }

    // Call Paystack Gateway
    const planCode = metadata.subscriptionId ? 
      (await this.subscriptionService.getSubscriptionById(metadata.subscriptionId))?.pricingPlan?.paystackPlanCode : 
      metadata.pricingPlanId ? (await this.pricingPlanService.findOne(metadata.pricingPlanId))?.paystackPlanCode : undefined;

    const { reference, authorizationUrl } = await this.paymentGateway.initializePayment(
        userEmail, 
        amount,
        metadata,
        planCode as string,
    );

    // Save PENDING transaction to Prisma
    const transaction = await this.transactionRepository.create({
      ...createTransaction,
      userId,
      amount,
      status: TransactionStatus.PENDING,
      gatewayTransactionId: reference,
    });

    return { transaction, authorizationUrl };
  }

  // ... (handlePaystackWebhook and verify methods unchanged)

  private async fulfillTransaction(transaction: TransactionEntity) {
    this.logger.log(`Fulfilling Transaction: ${transaction.id} - SubID: ${transaction.subscriptionId} - PlanID: ${transaction.pricingPlanId}`);
    
    await this.notifyAdminsOnTransactionCompletion(transaction);

    // --- Fund Distribution Logic ---
    // 1. Get the Organization Wallet (assuming a specific admin represents the organization)
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    if (superAdmins.length === 0) {
      throw new InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
    }
    const ORGANIZATION_ADMIN_ID = superAdmins[0].id; // Use the ID of the first SUPER_ADMIN

    let organizationWallet: any;
    try {
      organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, WalletOwnerType.ORGANIZATION);
    } catch (error) {
      if (error instanceof NotFoundException) {
        organizationWallet = await this.walletService.createWallet({
          ownerId: ORGANIZATION_ADMIN_ID,
          ownerType: WalletOwnerType.ORGANIZATION,
          initialBalance: 0,
        });
        this.logger.log(`Created Organization Wallet: ${organizationWallet.id}`);
      } else {
        throw error;
      }
    }

    const user = await this.userRepository.findById(transaction.userId);
    if (!user) {
      this.logger.error(`User ${transaction.userId} not found during transaction fulfillment`);
      throw new NotFoundException(`User ${transaction.userId} not found`);
    }

    // 2. Credit Organization Wallet with the full transaction amount
    // 🛡️ IDEMPOTENCY CHECK: Ensure we haven't already credited for this transaction
    const existingCredits = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(
        transaction.id,
        WalletRelatedEntityType.TRANSACTION
    );

    let isAlreadyCredited = false;
    if (existingCredits && existingCredits.length > 0) {
        // Check if we have a CREDIT to the organization wallet
        const creditTx = existingCredits.find(
            tx => tx.walletId === organizationWallet.id && tx.type === WalletTransactionType.CREDIT
        );
        if (creditTx) {
            isAlreadyCredited = true;
            this.logger.log(`Transaction ${transaction.id} already credited to Organization Wallet. Skipping...`);
        }
    }

    if (!isAlreadyCredited) {
        await this.walletService.creditWallet(organizationWallet.id, transaction.amount);
        await this.walletTransactionService.createWalletTransaction({
          walletId: organizationWallet.id,
          type: WalletTransactionType.CREDIT,
          amount: transaction.amount,
          description: `Payment from ${user.firstName} ${user.lastName} (${user.email}) via ${transaction.gateway} for ${transaction.orderId ? 'Order' : transaction.appointmentId ? 'Appointment' : 'Subscription'}`,
          relatedEntityId: transaction.id,
          relatedEntityType: WalletRelatedEntityType.TRANSACTION,
        });
        this.logger.log(`Organization Wallet ${organizationWallet.id} credited with ${transaction.amount} from transaction ${transaction.id}`);
    }


    // 3. Distribute funds based on transaction type
    if (transaction.orderId) {
        this.logger.log(`Fulfilling Order: ${transaction.orderId}`);
        await this.orderService.updateOrderStatus(transaction.orderId, { status: OrderStatus.CONFIRMED });
        // Fetch full order details including items and products for vendorId
        const order = await this.orderRepository.findById(transaction.orderId); // Use IOrderRepository to fetch with relations
        if (!order) {
          throw new NotFoundException(`Order ${transaction.orderId} not found during fulfillment.`);
        }

        // 🛡️ IDEMPOTENCY CHECK: Ensure we haven't already paid out vendors for this order
        const existingPayouts = await this.walletTransactionService.getWalletTransactionsByRelatedEntity(
            order.id,
            WalletRelatedEntityType.ORDER
        );

        let isOrderAlreadyPaidOut = false;
        if (existingPayouts && existingPayouts.length > 0) {
            // Check if we have any DEBIT from the organization wallet
            const payoutTx = existingPayouts.find(
                tx => tx.walletId === organizationWallet.id && tx.type === WalletTransactionType.DEBIT
            );
            if (payoutTx) {
                isOrderAlreadyPaidOut = true;
                this.logger.log(`Order ${order.id} already paid out to vendors. Skipping duplicate payout...`);
            }
        }

        if (!isOrderAlreadyPaidOut) {
            // Credit Vendors for their items (and debit Organization)
            const vendorPayouts: { [vendorId: string]: number } = {};
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    // Ensure item.product is loaded. findById should include it.
                    if (item.product && item.product.vendorId) {
                        vendorPayouts[item.product.vendorId] = (vendorPayouts[item.product.vendorId] || 0) + (item.price * item.quantity);
                    } else {
                      // Fallback if product not directly on item, fetch it.
                      const product = await this.productRepository.findById(item.productId);
                      if (product && product.vendorId) {
                         vendorPayouts[product.vendorId] = (vendorPayouts[product.vendorId] || 0) + (item.price * item.quantity);
                      }
                    }
                }
            }

            for (const vendorId in vendorPayouts) {
                const totalVendorSales = vendorPayouts[vendorId];
                const payoutAmount = totalVendorSales * 0.8; // 80% payout to vendor, 20% stays with Org
            let vendorWallet: any;
            try {
              vendorWallet = await this.walletService.getWalletByOwner(vendorId, WalletOwnerType.VENDOR);
            } catch (error) {
              if (error instanceof NotFoundException) {
                vendorWallet = await this.walletService.createWallet({
                  ownerId: vendorId,
                  ownerType: WalletOwnerType.VENDOR,
                  initialBalance: 0,
                });
                this.logger.log(`Created Vendor Wallet: ${vendorWallet.id} for Vendor ${vendorId}`);
              } else {
                throw error;
              }
            }

            // Debit Organization Wallet (Payout)
            await this.walletService.debitWallet(organizationWallet.id, payoutAmount);
            await this.walletTransactionService.createWalletTransaction({
                walletId: organizationWallet.id,
                type: WalletTransactionType.DEBIT,
                amount: payoutAmount,
                description: `Payout to Vendor ${vendorId} (80% share) for Order ${order.id}`,
                relatedEntityId: order.id,
                relatedEntityType: WalletRelatedEntityType.ORDER,
            });
            this.logger.log(`Organization Wallet ${organizationWallet.id} debited ${payoutAmount} (80%) for Vendor ${vendorId}`);


            // Credit Vendor Wallet
            await this.walletService.creditWallet(vendorWallet.id, payoutAmount);
            await this.walletTransactionService.createWalletTransaction({
                walletId: vendorWallet.id,
                type: WalletTransactionType.CREDIT,
                amount: payoutAmount,
                description: `Sales Earnings (80% share) from Order #${order.id} (Customer: ${user.firstName} ${user.lastName})`,
                relatedEntityId: order.id,
                relatedEntityType: WalletRelatedEntityType.ORDER,
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
            } as any);
        } else {
            this.logger.log(`Invoice already exists for Order ${order.id}. Skipping creation...`);
        }

        await this.notifyAdminsAndVendorsOnOrderCompletion(order);

        // 📧 Send Order Confirmation Emails to User AND Vendors (only fires after successful payment)
        try {
          const userForEmail = await this.userRepository.findById(order.userId);
          if (userForEmail && order.items) {
            // Email to buyer
            await this.mailService.sendOrderPurchaseEmail(userForEmail.email, order, 'USER');

            // 🛡️ RE-ENFORCED: Filter items for each unique vendor to prevent privacy leaks
            const vendorMap = new Map<string, any[]>();
            order.items.forEach(item => {
              if (item.product?.vendor?.email) {
                const email = item.product.vendor.email;
                if (!vendorMap.has(email)) {
                  vendorMap.set(email, []);
                }
                vendorMap.get(email)!.push(item);
              }
            });

            for (const [vendorEmail, items] of vendorMap.entries()) {
              // Create a shallow copy of order with only relevant items
              const vendorOrder = { ...order, items };
              await this.mailService.sendOrderPurchaseEmail(vendorEmail, vendorOrder, 'VENDOR');
              this.logger.log(`Vendor confirmation email sent to ${vendorEmail} with ${items.length} items.`);
            }
          }
        } catch (e) {
          this.logger.error(`Failed to send order confirmation emails for order ${order.id}`, e);
        }
    }

    if (transaction.appointmentId) {
        this.logger.log(`Fulfilling Appointment: ${transaction.appointmentId}`);
        await this.appointmentRepository.update(transaction.appointmentId, { 
            status: AppointmentStatus.CONFIRMED as any 
        });

        // 🛡️ RE-ENFORCED: Specialist credit is now handled in SpecialistAssignmentService.acceptAssignment
        // This ensures they are only paid when they actually accept the session.
    }

    // 🚀 ACTIVATE PENDING SUBSCRIPTION
    if (transaction.subscriptionId) {
        const sub = await this.subscriptionService.getSubscriptionById(transaction.subscriptionId);
        const plan = await this.pricingPlanService.findOne(sub.planId);
        const duration = plan?.durationDays || 30;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + duration); 

        this.logger.log(`Activating Pending Subscription: ${transaction.subscriptionId} (Plan: ${plan?.name}, Duration: ${duration} days)`);
        await this.subscriptionService.activateSubscription(transaction.subscriptionId, startDate, endDate);

        // 📧 Send Subscription Activation Email (only fires after successful payment + activation)
        try {
          const subUser = await this.userRepository.findById(transaction.userId);
          if (subUser) {
            await this.mailService.sendSubscriptionStatusEmail(
              subUser.email,
              plan?.name || 'Subscription Plan',
              'SUCCESS'
            );
          }
        } catch (e) {
          this.logger.error(`Failed to send subscription success email for subscription ${transaction.subscriptionId}`, e);
        }
    }
    // ⚠️ Legacy Fulfillment (Create new sub from scratch)
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
          status: 'ACTIVE' as any,
          autoRenew: true
      });
    } else {
        this.logger.warn(`Transaction fulfilled but no fulfillment path found (Order/Appointment/Sub/Plan missing)`);
    }
  }

  private async notifyAdminsOnTransactionCompletion(transaction: TransactionEntity): Promise<void> {
    const financeAdmins = await this.adminService.findByRole(AdminType.FINANCE_ADMIN);
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
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

    // 📧 Notify Relevant Admins via Email (Disabled per user request)
    await this.adminNotificationService.notify(
      'FINANCE',
      'Transaction Successful',
      `<p>A transaction has been completed successfully.</p>
       <p><strong>Transaction ID:</strong> ${transaction.id}</p>
       <p><strong>Amount:</strong> ₦${transaction.amount}</p>
       <p><strong>Gateway:</strong> ${transaction.gateway}</p>`,
       false // sendEmail = false
    );
  }

  private async notifyAdminsAndVendorsOnOrderCompletion(order: any): Promise<void> {
    const vendorManagers = await this.adminService.findByRole(AdminType.VENDOR_MANAGER);
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
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

    const vendorItems: { [vendorId: string]: any[] } = {};
    if (order.items) { // Ensure order.items exists
        for (const item of order.items) {
          // Assuming item.product is loaded and has vendorId
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

    // 📧 Notify Relevant Admins via Email (Disabled per user request)
    await this.adminNotificationService.notify(
      'SALES',
      'New Order Placed',
      `<p>A new product order has been confirmed.</p>
       <p><strong>Order ID:</strong> ${order.id}</p>
       <p><strong>Total Amount:</strong> ₦${order.totalAmount}</p>`,
       false // sendEmail = false
    );
  }

  async handlePaystackWebhook(payload: any, signature: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
    
    if (hash !== signature) {
      this.logger.error('Invalid Webhook Signature detected');
      // 🚀 CEO LOGIC: Log the failed attempt anyway for security audit
      await this.prisma.webhookLog.create({
        data: {
          gateway: 'PAYSTACK',
          event: payload.event || 'unknown',
          payload: payload as any,
          status: 'INVALID_SIGNATURE'
        }
      });
      throw new BadRequestException('Invalid signature');
    }

    const event = payload.event;
    const data = payload.data;

    // 🚀 CEO LOGIC: Log the valid payload for debugging/audit
    await this.prisma.webhookLog.create({
      data: {
        gateway: 'PAYSTACK',
        event: event,
        payload: payload as any,
        status: 'RECEIVED'
      }
    });

    switch (event) {
      case 'charge.success':
        this.logger.log(`Payment Success Webhook for ref: ${data.reference}`);
        // Handle renewal (if reference not in our system)
        const existingTx = await this.transactionRepository.findByGatewayTransactionId(data.reference);
        if (!existingTx && data.subscription) {
            this.logger.log(`Recurring charge detected for subscription: ${data.subscription}`);
            const subscription = await this.subscriptionService.findByGatewaySubscriptionId(data.subscription);
            if (subscription) {
                // Create a new transaction for the renewal
                const newTx = await this.transactionRepository.create({
                    userId: subscription.userId,
                    amount: data.amount / 100,
                    gateway: 'PAYSTACK',
                    gatewayTransactionId: data.reference,
                    status: TransactionStatus.COMPLETED,
                    subscriptionId: subscription.id,
                });
                await this.fulfillTransaction(newTx);
                return { status: 'renewal_processed' };
            }
        }
        return this.verifyTransactionByReference(data.reference);

      case 'subscription.create':
        this.logger.log(`Subscription Created Webhook for SUB: ${data.subscription_code}`);
        // Link Paystack subscription_code to our subscription via metadata or email+plan
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

  async verifyTransactionByReference(reference: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findByGatewayTransactionId(reference); 

    if (!transaction) throw new NotFoundException('Transaction reference not found');
    
    // 🛡️ Robust Verification: Even if COMPLETED, check if fulfillment is needed
    if (transaction.status === TransactionStatus.COMPLETED) {
        await this.fulfillTransaction(transaction);
        return transaction;
    }

    return this.processVerification(transaction);
  }

  async verifyTransactionById(transactionId: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');

    // 🛡️ Robust Verification: Even if COMPLETED, check if fulfillment is needed
    if (transaction.status === TransactionStatus.COMPLETED) {
        await this.fulfillTransaction(transaction);
        return transaction;
    }

    return this.processVerification(transaction);
  }

  private async processVerification(transaction: TransactionEntity): Promise<TransactionEntity> {
    const reference = transaction.gatewayTransactionId;
    const verificationResult = await this.paymentGateway.verifyPayment(reference);

        if (verificationResult.status === 'COMPLETED') {
            const updatedTransaction = await this.transactionRepository.update(transaction.id, {
                status: TransactionStatus.COMPLETED,
            });

            // fulfillTransaction handles all emails (order confirmation + subscription activation emails)
            await this.fulfillTransaction(updatedTransaction);

            // 📧 For FAILED subscription/plan payments, send a failure email.
            // Success emails are already sent inside fulfillTransaction per path.
            return updatedTransaction;
        } else if (verificationResult.status === 'PENDING') {
            throw new BadRequestException('Payment is still being processed. Please try again later.');
        }
        else { // FAILED
            await this.transactionRepository.update(transaction.id, { status: TransactionStatus.FAILED });

            // 📧 Send failure email only for subscription/plan transactions
            if (transaction.subscriptionId || transaction.pricingPlanId) {
                try {
                    const user = await this.userRepository.findById(transaction.userId);
                    if (user) {
                        let planName = 'Subscription Plan';
                        if (transaction.subscriptionId) {
                            const sub = await this.subscriptionService.getSubscriptionById(transaction.subscriptionId);
                            planName = sub?.pricingPlan?.name || 'Subscription Plan';
                        } else if (transaction.pricingPlanId) {
                            const plan = await this.pricingPlanService.findOne(transaction.pricingPlanId);
                            planName = plan?.name || 'Subscription Plan';
                        }
                        await this.mailService.sendSubscriptionStatusEmail(user.email, planName, 'FAILED');
                    }
                } catch (e) {
                    this.logger.error(`Failed to send subscription failure email for transaction ${transaction.id}`, e);
                }
            }

            // 🚀 ACTIVATE ORDER CANCELLATION ON FAILURE
            if (transaction.orderId) {
                this.logger.log(`Payment failed for Order: ${transaction.orderId}. Restoring stock and cancelling order.`);
                await this.orderService.updateOrderStatus(transaction.orderId, { status: OrderStatus.CANCELLED });
                await this.orderService.restoreStock(transaction.orderId);
            }

            throw new BadRequestException('Payment was not successful');
        }
  }



  async getAllTransaction(): Promise<TransactionEntity[]> {
    return await this.transactionRepository.get();
  }

  async getTransactionById(id: string): Promise<TransactionEntity> {
    // 1. Try finding by Database ID first
    let transaction = await this.transactionRepository.findById(id);
    
    // 2. If not found, try finding by Gateway Reference
    if (!transaction) {
        transaction = await this.transactionRepository.findByGatewayTransactionId(id);
    }

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
}
}

