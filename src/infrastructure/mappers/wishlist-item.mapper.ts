import { WishlistItemEntity } from 'src/domain/entities/wishlist-item.entity';
import { Product, WishlistItem } from '@prisma/client';
import { ProductMapper } from './product.mapper';

type WishlistItemWithProduct = WishlistItem & {
    product: Product;
};

export class WishlistItemMapper {
    static toDomain(prismaWishlistItem: WishlistItemWithProduct): WishlistItemEntity {
        return new WishlistItemEntity({
            id: prismaWishlistItem.id,
            wishlistId: prismaWishlistItem.wishlistId,
            productId: prismaWishlistItem.productId,
            product: ProductMapper.toDomain(prismaWishlistItem.product),
            createdAt: prismaWishlistItem.createdAt,
        });
    }

    static toPrisma(wishlistItem: WishlistItemEntity): Omit<WishlistItem, 'createdAt'> {
        return {
            id: wishlistItem.id,
            wishlistId: wishlistItem.wishlistId,
            productId: wishlistItem.productId,
        };
    }
}