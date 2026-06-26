import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { Wishlist } from '@prisma/client';
export declare class WishlistMapper {
    static toDomain(prismaWishlist: Wishlist): WishlistEntity;
    static toPrisma(wishlist: WishlistEntity): Omit<Wishlist, 'createdAt' | 'updatedAt'>;
}
