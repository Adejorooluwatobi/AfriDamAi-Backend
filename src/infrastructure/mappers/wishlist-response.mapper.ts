import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { WishlistResponseDto } from 'src/application/DTOs/wishlists/wishlist-response.dto';

export class WishlistResponseMapper {
    /**
     * Convert WishlistEntity to WishlistResponseDto with formatted items
     */
    static toResponseDto(wishlist: WishlistEntity): WishlistResponseDto {
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
        })) as unknown as WishlistResponseDto['items'];

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
