import { Injectable, Inject, NotFoundException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import type { OrderRepositoryInterface } from '../repositories/order.repository.interface';
import { OrderEntity } from '../entities/order.entity';
import { UpdateOrderDto } from 'src/application/DTOs/orders/update-order.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from './product.service';
import { CreateOrderParams } from 'src/utils/type';
import { CartService } from './cart.service';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeEntity } from '../entities/product-attribute.entity';
import { AppGateway } from 'src/shared/websockets/app.gateway'; // Import AppGateway
import { NotificationService } from './notification.service'; // Import NotificationService
import { OrderStatus } from '@prisma/client'; // Import OrderStatus enum
import { AdminService } from './admin.service'; // Import AdminService


@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly productAttributeService: ProductAttributeService,
    private readonly appGateway: AppGateway, // Inject AppGateway
    private readonly notificationService: NotificationService, // Inject NotificationService
    private readonly adminService: AdminService, // Inject AdminService
  ) {}

  async createOrder(params: { userId: string; shippingAddress: string; items: { productId: string; quantity: number }[] }): Promise<OrderEntity> {
    const { userId, items, shippingAddress } = params;

    // 1. Validation Phase (Read-Only)
    const validatedItems: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productService.findOneProductById(item.productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is currently unavailable`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const price = product.basePrice;
      totalAmount += price * item.quantity;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      });
    }

    // 2. Execution Phase (Transaction)
    const order = await this.orderRepository.createTransactional({
      userId,
      shippingAddress,
      totalAmount,
      items: validatedItems,
    });

    // 3. Clear Cart (Non-blocking)
    try {
      await this.cartService.clearCart(userId);
    } catch (e) {
      this.logger.error(`Failed to clear cart for user ${userId}`, e);
    }

    return order;
  }

  async findOrderById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async findOrdersByUserId(userId: string): Promise<OrderEntity[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepository.findAll();
  }

  async updateOrderStatus(id: string, params: UpdateOrderDto): Promise<OrderEntity> {
    const existingOrder = await this.orderRepository.findById(id); // Fetch the existing order
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    const oldStatus = existingOrder.status;

    if (params.status === OrderStatus.CONFIRMED && existingOrder.status !== OrderStatus.CONFIRMED) {
      for (const item of existingOrder.items) {
          const product = await this.productService.findOneProductById(item.productId);
          const newStock = product.stock - item.quantity;
          await this.productService.updateProduct(item.productId, { stock: newStock } as any);
      }
    }

    const updatedOrder = await this.orderRepository.update(id, params);

    // If order status changed to COMPLETED, send notifications
    if (updatedOrder.status === OrderStatus.DELIVERED && oldStatus !== OrderStatus.DELIVERED) {
      this.logger.log(`Order ${id} status changed to DELIVERED. Sending notifications.`);
      // Fetch the full order with relations for notifications
      const fullOrder = await this.orderRepository.findById(id);

      if (!fullOrder) {
        this.logger.error(`Could not fetch full order ${id} for notification purposes.`);
        return updatedOrder;
      }

      // 1. Notify Admin
      const admins = await this.adminService.findAllAdmin(); // Changed from findAllAdmins()
      for (const admin of admins) {
        if (admin.isActive) {
          const title = 'New Order Completed!';
          const message = `Order #${fullOrder.id} has been delivered and completed by user ${fullOrder.userId}. Total amount: ${fullOrder.totalAmount}.`;
          await this.notificationService.createNotification({
            adminId: admin.id,
            title,
            message,
          });
          this.appGateway.sendToUser(admin.id, 'newNotification', { title, message, orderId: fullOrder.id, type: 'orderCompletedAdmin' });
        }
      }

      // 2. Notify Vendors
      const vendorsToNotify: Map<string, { vendorId: string; products: { name: string; quantity: number }[] }> = new Map();

      fullOrder.items.forEach(item => {
        if (item.product?.vendorId && item.product.vendor) {
          if (!vendorsToNotify.has(item.product.vendorId)) {
            vendorsToNotify.set(item.product.vendorId, { vendorId: item.product.vendorId, products: [] });
          }
          vendorsToNotify.get(item.product.vendorId).products.push({
            name: item.product.name,
            quantity: item.quantity,
          });
        }
      });

      for (const [vendorId, vendorData] of vendorsToNotify) {
        const title = 'Your Product(s) Sold!';
        const productList = vendorData.products.map(p => `${p.name} (x${p.quantity})`).join(', ');
        const message = `Products "${productList}" from Order #${fullOrder.id} have been sold.`;

        // Create DB notification for vendor
        await this.notificationService.createNotification({
          vendorId: vendorId,
          title,
          message,
        });

        // Send real-time notification to vendor
        this.appGateway.sendToUser(vendorId, 'newNotification', { title, message, orderId: fullOrder.id, products: vendorData.products, type: 'orderCompletedVendor' });
      }
    }
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.findOrderById(id); // Ensures order exists before deletion
    await this.orderRepository.delete(id);
  }

  async restoreStock(id: string): Promise<void> {
    const order = await this.findOrderById(id);
    if (!order.items) return;

    for (const item of order.items) {
      await this.productService.updateProduct(item.productId, {
        stock: (await this.productService.findOneProductById(item.productId)).stock + item.quantity
      } as any);
    }
  }

  async markOrderAsReceived(orderId: string, userId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only mark your own orders as received');
    }

    if (order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.CONFIRMED) {
       // Logic: Can only receive if it's confirmed or shipped. 
       // If it's still PENDING, it might not have been processed.
       // However, to be flexible, we allow marking as DELIVERED if it's at least CONFIRMED.
    }

    return this.orderRepository.update(orderId, { status: OrderStatus.DELIVERED });
  }

}