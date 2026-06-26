import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { WishlistResponseDto } from 'src/application/DTOs/wishlists/wishlist-response.dto';
export declare class WishlistResponseMapper {
    static toResponseDto(wishlist: WishlistEntity): WishlistResponseDto;
}
