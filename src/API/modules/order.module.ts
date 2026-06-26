import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../../domain/services/order.service';
import { PrismaOrderRepository } from '../../infrastructure/persistence/prisma/prisma-order.repository';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { ProductModule } from './product.module';
import { CartModule } from './cart.module';
import { ProductAttributeModule } from './product-attribute.module';
import { SharedModule } from '../../shared/shared.module'; // Import SharedModule
import { NotificationModule } from './notification.module'; // Import NotificationModule
import { AdminModule } from './admin.module'; // Import AdminModule

@Module({
  imports: [PrismaModule, ProductModule, CartModule, ProductAttributeModule, SharedModule, NotificationModule, AdminModule], // Add AdminModule
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [OrderService, 'IOrderRepository'], // Export IOrderRepository
})
export class OrderModule {}