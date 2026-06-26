"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartMapper = void 0;
const cart_entity_1 = require("../../domain/entities/cart.entity");
const cart_item_entity_1 = require("../../domain/entities/cart-item.entity");
class CartMapper {
    static toDomain(raw) {
        return new cart_entity_1.CartEntity({
            id: raw.id,
            userId: raw.userId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            items: raw.items?.map((item) => new cart_item_entity_1.CartItemEntity({
                id: item.id,
                cartId: item.cartId,
                productId: item.productId,
                quantity: item.quantity,
            })) || [],
        });
    }
    static toPrisma(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            items: entity.items?.length
                ? {
                    create: entity.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }
                : undefined,
        };
    }
}
exports.CartMapper = CartMapper;
//# sourceMappingURL=cart.mapper.js.map