import { OrderService } from '../../domain/services/order.service';
import { CreateOrderDto } from '../../application/DTOs/orders/create-order.dto';
import { UpdateOrderDto } from '../../application/DTOs/orders/update-order.dto';
import { OrderEntity } from 'src/domain/entities/order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity;
    }>;
    findAll(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity[];
    }>;
    findOne(req: any, id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity;
    }>;
    findByUser(req: any, userIdParam: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity[];
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity;
    }>;
    remove(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    markAsReceived(req: any, id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: OrderEntity;
    }>;
    private extractUserId;
}
