"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemMapper = void 0;
const order_item_entity_1 = require("../../domain/entities/order-item.entity");
class OrderItemMapper {
    static toDomain(prismaOrderItem) {
        return new order_item_entity_1.OrderItemEntity({
            id: prismaOrderItem.id,
            orderId: prismaOrderItem.orderId,
            productId: prismaOrderItem.productId,
            quantity: prismaOrderItem.quantity,
            price: prismaOrderItem.price,
        });
    }
    static toPrisma(orderItem) {
        return {
            id: orderItem.id,
            orderId: orderItem.orderId,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
        };
    }
}
exports.OrderItemMapper = OrderItemMapper;
//# sourceMappingURL=order-item.mapper.js.map