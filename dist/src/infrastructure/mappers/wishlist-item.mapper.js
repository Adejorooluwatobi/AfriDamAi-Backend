"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistItemMapper = void 0;
const wishlist_item_entity_1 = require("../../domain/entities/wishlist-item.entity");
const product_mapper_1 = require("./product.mapper");
class WishlistItemMapper {
    static toDomain(prismaWishlistItem) {
        return new wishlist_item_entity_1.WishlistItemEntity({
            id: prismaWishlistItem.id,
            wishlistId: prismaWishlistItem.wishlistId,
            productId: prismaWishlistItem.productId,
            product: product_mapper_1.ProductMapper.toDomain(prismaWishlistItem.product),
            createdAt: prismaWishlistItem.createdAt,
        });
    }
    static toPrisma(wishlistItem) {
        return {
            id: wishlistItem.id,
            wishlistId: wishlistItem.wishlistId,
            productId: wishlistItem.productId,
        };
    }
}
exports.WishlistItemMapper = WishlistItemMapper;
//# sourceMappingURL=wishlist-item.mapper.js.map