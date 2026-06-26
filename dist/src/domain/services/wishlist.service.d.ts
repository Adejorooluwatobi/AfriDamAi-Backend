import { WishlistEntity } from "../entities/wishlist.entity";
import { CreateWishlistItemParams, CreateWishlistParams } from "src/utils/type";
import type { WishlistRepositoryInterface } from "../repositories/wishlist.repository.interface";
export declare class WishlistService {
    private readonly wishlistRepository;
    constructor(wishlistRepository: WishlistRepositoryInterface);
    createWishlist(wishlistDetails: CreateWishlistParams, userId: string, userType: string): Promise<WishlistEntity>;
    getWishlistByUserId(userId: string): Promise<WishlistEntity | null>;
    getWishlistById(id: string, userId: string): Promise<WishlistEntity | null>;
    addItemToWishlist(productParams: Partial<CreateWishlistItemParams>, userId: string): Promise<WishlistEntity>;
    removeItemFromWishlist(productParams: Partial<CreateWishlistItemParams>, userId: string): Promise<WishlistEntity>;
    clearWishlist(wishlistId: string): Promise<void>;
}
