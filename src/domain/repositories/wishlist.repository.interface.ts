import { WishlistEntity } from '../entities/wishlist.entity';
import { CreateWishlistParams, CreateWishlistItemParams } from 'src/utils/type';

export interface WishlistRepositoryInterface {
    create(params: CreateWishlistParams): Promise<WishlistEntity>;
    findByUserId(userId: string): Promise<WishlistEntity | null>;
    findById(id: string): Promise<WishlistEntity | null>;
    addItem(params: CreateWishlistItemParams): Promise<WishlistEntity>;
    removeItem(params: CreateWishlistItemParams): Promise<WishlistEntity>;
    clear(wishlistId: string): Promise<void>;
}