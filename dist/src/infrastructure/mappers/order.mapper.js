"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMapper = void 0;
const order_entity_1 = require("../../domain/entities/order.entity");
const order_item_entity_1 = require("../../domain/entities/order-item.entity");
const product_entity_1 = require("../../domain/entities/product.entity");
class OrderMapper {
    static toDomain(prismaOrder) {
        return new order_entity_1.OrderEntity({
            id: prismaOrder.id,
            userId: prismaOrder.userId,
            status: prismaOrder.status,
            totalAmount: prismaOrder.totalAmount,
            shippingAddress: prismaOrder.shippingAddress,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            user: prismaOrder.user ? prismaOrder.user : undefined,
            items: prismaOrder.items?.map(item => new order_item_entity_1.OrderItemEntity({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                product: item.product ? new product_entity_1.ProductEntity({
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
    static toPrisma(order) {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
        };
    }
}
exports.OrderMapper = OrderMapper;
//# sourceMappingURL=order.mapper.js.map