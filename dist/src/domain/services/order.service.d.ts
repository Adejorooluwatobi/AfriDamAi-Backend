import type { OrderRepositoryInterface } from '../repositories/order.repository.interface';
import { OrderEntity } from '../entities/order.entity';
import { UpdateOrderDto } from 'src/application/DTOs/orders/update-order.dto';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { ProductAttributeService } from './product-attribute.service';
import { AppGateway } from 'src/shared/websockets/app.gateway';
import { NotificationService } from './notification.service';
import { AdminService } from './admin.service';
export declare class OrderService {
    private readonly orderRepository;
    private readonly productService;
    private readonly cartService;
    private readonly productAttributeService;
    private readonly appGateway;
    private readonly notificationService;
    private readonly adminService;
    private readonly logger;
    constructor(orderRepository: OrderRepositoryInterface, productService: ProductService, cartService: CartService, productAttributeService: ProductAttributeService, appGateway: AppGateway, notificationService: NotificationService, adminService: AdminService);
    createOrder(params: {
        userId: string;
        shippingAddress: string;
        items: {
            productId: string;
            quantity: number;
        }[];
    }): Promise<OrderEntity>;
    findOrderById(id: string): Promise<OrderEntity>;
    findOrdersByUserId(userId: string): Promise<OrderEntity[]>;
    findAllOrders(): Promise<OrderEntity[]>;
    updateOrderStatus(id: string, params: UpdateOrderDto): Promise<OrderEntity>;
    deleteOrder(id: string): Promise<void>;
    restoreStock(id: string): Promise<void>;
    markOrderAsReceived(orderId: string, userId: string): Promise<OrderEntity>;
}
