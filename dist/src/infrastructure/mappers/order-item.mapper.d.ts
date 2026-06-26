import { OrderItemEntity } from 'src/domain/entities/order-item.entity';
import { OrderItem } from '@prisma/client';
export declare class OrderItemMapper {
    static toDomain(prismaOrderItem: OrderItem): OrderItemEntity;
    static toPrisma(orderItem: OrderItemEntity): OrderItem;
}
