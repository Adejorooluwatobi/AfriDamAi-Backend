import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { Wishlist } from '@prisma/client';

export class WishlistMapper {
    static toDomain(prismaWishlist: Wishlist): WishlistEntity {
        return new WishlistEntity({
            id: prismaWishlist.id,
            userId: prismaWishlist.userId,
            createdAt: prismaWishlist.createdAt,
            updatedAt: prismaWishlist.updatedAt,
        });
    }

    static toPrisma(wishlist: WishlistEntity): Omit<Wishlist, 'createdAt' | 'updatedAt'> {
        return {
            id: wishlist.id,
            userId: wishlist.userId,
        };
    }
}