import { WishlistService } from 'src/domain/services/wishlist.service';
import { CreateWishlistItemDto } from 'src/application/DTOs/wishlists/create-wishlist-item.dto';
import { WishlistResponseDto } from 'src/application/DTOs/wishlists/wishlist-response.dto';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    create(req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: WishlistResponseDto;
    }>;
    getMyWishlist(req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: WishlistResponseDto;
    }>;
    getWishlist(id: string, req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: WishlistResponseDto;
    }>;
    addItem(productId: string, dto: CreateWishlistItemDto, req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: WishlistResponseDto;
    }>;
    removeItem(productId: string, dto: CreateWishlistItemDto, req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: WishlistResponseDto;
    }>;
    clearWishlist(id: string, req: Record<string, unknown>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: {
            id: string;
            items: any[];
            totalItems: number;
        };
    }>;
    private extractUserId;
}
