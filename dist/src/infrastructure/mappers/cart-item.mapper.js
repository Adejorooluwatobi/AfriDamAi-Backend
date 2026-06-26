"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemMapper = void 0;
const cart_item_entity_1 = require("../../domain/entities/cart-item.entity");
class CartItemMapper {
    static toDomain(prismaCartItem) {
        return new cart_item_entity_1.CartItemEntity({
            id: prismaCartItem.id,
            cartId: prismaCartItem.cartId,
            productId: prismaCartItem.productId,
            quantity: prismaCartItem.quantity,
        });
    }
    static toPrisma(cartItem) {
        return {
            id: cartItem.id,
            cartId: cartItem.cartId,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
        };
    }
}
exports.CartItemMapper = CartItemMapper;
//# sourceMappingURL=cart-item.mapper.js.map