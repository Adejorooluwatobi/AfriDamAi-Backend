import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWishlistItemDto {
    @ApiProperty()
    @IsString()
    wishlistId: string;

    @ApiProperty()
    @IsString()
    productId: string;
}