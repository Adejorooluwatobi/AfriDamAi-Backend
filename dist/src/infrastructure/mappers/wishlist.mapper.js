"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistMapper = void 0;
const wishlist_entity_1 = require("../../domain/entities/wishlist.entity");
class WishlistMapper {
    static toDomain(prismaWishlist) {
        return new wishlist_entity_1.WishlistEntity({
            id: prismaWishlist.id,
            userId: prismaWishlist.userId,
            createdAt: prismaWishlist.createdAt,
            updatedAt: prismaWishlist.updatedAt,
        });
    }
    static toPrisma(wishlist) {
        return {
            id: wishlist.id,
            userId: wishlist.userId,
        };
    }
}
exports.WishlistMapper = WishlistMapper;
//# sourceMappingURL=wishlist.mapper.js.map