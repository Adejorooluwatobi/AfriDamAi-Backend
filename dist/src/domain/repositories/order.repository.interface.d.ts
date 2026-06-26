import { OrderEntity } from '../entities/order.entity';
import { CreateOrderParams, UpdateOrderParams } from 'src/utils/type';
export interface OrderRepositoryInterface {
    createTransactional(params: CreateOrderParams): Promise<OrderEntity>;
    findById(id: string): Promise<OrderEntity | null>;
    findByUserId(userId: string): Promise<OrderEntity[]>;
    findAll(): Promise<OrderEntity[]>;
    update(id: string, params: UpdateOrderParams): Promise<OrderEntity>;
    delete(id: string): Promise<void>;
    findPendingOrdersOlderThan(date: Date): Promise<OrderEntity[]>;
}
