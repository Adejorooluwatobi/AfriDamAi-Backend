import { OrderItemEntity } from 'src/domain/entities/order-item.entity';
import { OrderItem } from '@prisma/client';

export class OrderItemMapper {
    static toDomain(prismaOrderItem: OrderItem): OrderItemEntity {
        return new OrderItemEntity({
            id: prismaOrderItem.id,
            orderId: prismaOrderItem.orderId,
            productId: prismaOrderItem.productId,
            quantity: prismaOrderItem.quantity,
            price: prismaOrderItem.price,
        });
    }

    static toPrisma(orderItem: OrderItemEntity): OrderItem {
        return {
            id: orderItem.id,
            orderId: orderItem.orderId,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
        };
    }
}