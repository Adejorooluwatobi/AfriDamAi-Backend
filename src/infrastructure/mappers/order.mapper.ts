import { OrderEntity, OrderStatus } from 'src/domain/entities/order.entity';
import { OrderItemEntity } from 'src/domain/entities/order-item.entity';
import { ProductEntity } from 'src/domain/entities/product.entity';
import { Order, OrderItem, Product } from '@prisma/client';

export class OrderMapper {
    static toDomain(prismaOrder: Order & { 
        items?: (OrderItem & { product?: Product & { vendor?: any } })[],
        user?: any 
    }): OrderEntity {
        return new OrderEntity({
            id: prismaOrder.id,
            userId: prismaOrder.userId,
            status: prismaOrder.status as OrderStatus,
            totalAmount: prismaOrder.totalAmount,
            shippingAddress: prismaOrder.shippingAddress,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            user: prismaOrder.user ? prismaOrder.user : undefined,
            items: prismaOrder.items?.map(item => new OrderItemEntity({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                product: item.product ? new ProductEntity({
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    description: item.product.description,
                    basePrice: item.product.basePrice,
                    imageUrl: item.product.imageUrl,
                    isActive: item.product.isActive,
                    stock: item.product.stock,
                    vendor: item.product.vendor ? item.product.vendor : undefined,
                }) : undefined
            }))
        });
    }

    static toPrisma(order: OrderEntity): Omit<Order, 'createdAt' | 'updatedAt'> {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
        };
    }
}