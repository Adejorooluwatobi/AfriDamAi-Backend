import { WishlistItemResponseDto } from './wishlist-item-response.dto';
export declare class WishlistResponseDto {
    id: string;
    userId: string;
    items: WishlistItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    totalItems: number;
}
