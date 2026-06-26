import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from 'src/domain/services/transaction.service';
import { PrismaTransactionRepository } from 'src/infrastructure/persistence/prisma/prisma-transaction.repository';
import { SharedModule } from 'src/shared/shared.module';
import { OrderModule } from './order.module';
import { InvoiceModule } from './invoice.module';
// import { FlutterwaveGateway } from 'src/infrastructure/payment/gateways/flutterwave.gateway';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
// 🛡️ Import the repository to resolve the dependency
import { PrismaOrderRepository } from 'src/infrastructure/persistence/prisma/prisma-order.repository';
import { PrismaProductRepository } from 'src/infrastructure/persistence/prisma/prisma-product.repository';
import { PrismaAppointmentRepository } from 'src/infrastructure/persistence/prisma/prisma-appointment.repository';

import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/prisma-user.repository';
import { PaystackGateway } from 'src/infrastructure/payment/gateways/paystack.gateway';
import { PricingPlanModule } from './pricing-plan.module';
import { SubscriptionModule } from './subscription.module';

import { WebhookController } from '../controllers/webhook.controller';
import { AdminModule } from './admin.module';
import { NotificationModule } from './notification.module';
import { WalletModule } from './wallet.module'; // Import WalletModule

@Module({
  imports: [
    HttpModule,
    SharedModule,
    OrderModule,
    InvoiceModule,
    PrismaModule,
    PricingPlanModule,
    SubscriptionModule,
    AdminModule,
    NotificationModule,
    WalletModule, // Add WalletModule here
  ],
  controllers: [TransactionController, WebhookController],
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      // Rule 7: Specifically wiring PaystackGateway to the IPaymentGateway interface
      provide: 'IPaymentGateway',
      useClass: PaystackGateway, 
    },
    {
      // Essential for updating clinical appointment status after payment
      provide: 'IAppointmentRepository',
      useClass: PrismaAppointmentRepository,
    },
    {
      // Rule 7: Used by TransactionService to fetch the payer's email address
      provide: 'IUserRepository', 
      useClass: PrismaUserRepository,
    },
    {
      // Explicitly provide IOrderRepository for TransactionService
      provide: 'IOrderRepository',
      useClass: PrismaOrderRepository,
    },
    {
      // Explicitly provide IProductRepository for TransactionService
      provide: 'IProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
  exports: [
    TransactionService, 
    'ITransactionRepository', 
    'IPaymentGateway'
  ],
})
export class TransactionModule {}