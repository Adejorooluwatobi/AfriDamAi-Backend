import { ApiProperty } from '@nestjs/swagger';
import { WishlistItemResponseDto } from './wishlist-item-response.dto';

export class WishlistResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: [WishlistItemResponseDto] })
    items: WishlistItemResponseDto[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    totalItems: number;
}
