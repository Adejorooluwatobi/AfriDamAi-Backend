import { Injectable, ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { WishlistEntity } from "../entities/wishlist.entity";
import { CreateWishlistItemParams, CreateWishlistParams } from "src/utils/type";
import type { WishlistRepositoryInterface } from "../repositories/wishlist.repository.interface";


@Injectable()
export class WishlistService {
    constructor(@Inject('IWishlistRepository')private readonly wishlistRepository: WishlistRepositoryInterface) {}

    async createWishlist(wishlistDetails: CreateWishlistParams, userId: string, userType: string): Promise<WishlistEntity> {
        const existingWishlist = await this.wishlistRepository.findByUserId(userId);
        if (existingWishlist) {
            throw new ConflictException(`Wishlist already exists for this user`);
        }
        
        const wishlistCreateData: CreateWishlistParams = { userId };
        
        // Override with user type
        if (userType === 'user') wishlistCreateData.userId = userId;
        
        const wishlist = await this.wishlistRepository.create(wishlistCreateData);
        return wishlist;
    }

    /**
     * Get user's wishlist with all items and product details
     * @param userId - The user ID
     * @returns WishlistEntity with items and product information, or null if no wishlist exists
     */
    async getWishlistByUserId(userId: string): Promise<WishlistEntity | null> {
        const existingWishlist = await this.wishlistRepository.findByUserId(userId);
        return existingWishlist || null;
    }

    /**
     * Get wishlist by ID with all items and product details
     * @param id - The wishlist ID
     * @param userId - The user ID (for authorization)
     * @returns WishlistEntity with items and product information
     */
    async getWishlistById(id: string, userId: string): Promise<WishlistEntity | null> {
        const wishlist = await this.wishlistRepository.findById(id);
        if (!wishlist) {
            throw new NotFoundException(`Wishlist not found`);
        }
        // Authorization check: ensure user owns this wishlist
        if (wishlist.userId !== userId) {
            throw new NotFoundException(`Wishlist not found`);
        }
        return wishlist;
    }

    /**
     * Add an item to user's wishlist
     * Auto-creates wishlist if it doesn't exist
     * @param productParams - The product parameters
     * @param userId - The user ID
     * @returns Updated WishlistEntity with all items
     */
    async addItemToWishlist(productParams: Partial<CreateWishlistItemParams>, userId: string): Promise<WishlistEntity> {
        // Auto-create wishlist if it doesn't exist
        let wishlist = await this.wishlistRepository.findByUserId(userId);
        if (!wishlist) {
            wishlist = await this.wishlistRepository.create({ userId });
        }
        
        // Add item to the user's wishlist
        const updatedWishlist = await this.wishlistRepository.addItem({
            wishlistId: wishlist.id,
            productId: productParams.productId,
        } as CreateWishlistItemParams);
        return updatedWishlist;
    }

    /**
     * Remove an item from user's wishlist
     * @param productParams - The product parameters
     * @param userId - The user ID
     * @returns Updated WishlistEntity with remaining items
     */
    async removeItemFromWishlist(productParams: Partial<CreateWishlistItemParams>, userId: string): Promise<WishlistEntity> {
        // Find user's wishlist
        const wishlist = await this.wishlistRepository.findByUserId(userId);
        if (!wishlist) {
            throw new NotFoundException(`Wishlist does not exist for this user`);
        }
        
        // Remove item from the user's wishlist
        const updatedWishlist = await this.wishlistRepository.removeItem({
            wishlistId: wishlist.id,
            productId: productParams.productId,
        } as CreateWishlistItemParams);
        return updatedWishlist;
    }

    /**
     * Clear all items from a wishlist
     * @param wishlistId - The wishlist ID
     */
    async clearWishlist(wishlistId: string): Promise<void> {
        await this.wishlistRepository.clear(wishlistId);
        return;
    }

}