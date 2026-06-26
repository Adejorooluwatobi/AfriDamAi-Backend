import { WishlistItemEntity } from 'src/domain/entities/wishlist-item.entity';
import { Product, WishlistItem } from '@prisma/client';
type WishlistItemWithProduct = WishlistItem & {
    product: Product;
};
export declare class WishlistItemMapper {
    static toDomain(prismaWishlistItem: WishlistItemWithProduct): WishlistItemEntity;
    static toPrisma(wishlistItem: WishlistItemEntity): Omit<WishlistItem, 'createdAt'>;
}
export {};
