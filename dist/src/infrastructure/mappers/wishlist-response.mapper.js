"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistResponseMapper = void 0;
class WishlistResponseMapper {
    static toResponseDto(wishlist) {
        const formattedItems = (wishlist.items || []).map((item) => ({
            id: item.id,
            wishlistId: item.wishlistId,
            productId: item.productId,
            product: item.product ? {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                description: item.product.description,
                basePrice: item.product.basePrice,
                imageUrl: item.product.imageUrl,
                isActive: item.product.isActive,
                stock: item.product.stock,
                createdAt: item.product.createdAt,
                updatedAt: item.product.updatedAt
            } : {
                id: '',
                name: '',
                slug: '',
                basePrice: 0,
                isActive: false,
                stock: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            createdAt: item.createdAt
        }));
        return {
            id: wishlist.id,
            userId: wishlist.userId,
            items: formattedItems,
            totalItems: (wishlist.items || []).length,
            createdAt: wishlist.createdAt,
            updatedAt: wishlist.updatedAt
        };
    }
}
exports.WishlistResponseMapper = WishlistResponseMapper;
//# sourceMappingURL=wishlist-response.mapper.js.map