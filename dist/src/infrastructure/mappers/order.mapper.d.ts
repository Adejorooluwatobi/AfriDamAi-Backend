import { OrderEntity } from 'src/domain/entities/order.entity';
import { Order, OrderItem, Product } from '@prisma/client';
export declare class OrderMapper {
    static toDomain(prismaOrder: Order & {
        items?: (OrderItem & {
            product?: Product & {
                vendor?: any;
            };
        })[];
        user?: any;
    }): OrderEntity;
    static toPrisma(order: OrderEntity): Omit<Order, 'createdAt' | 'updatedAt'>;
}
