import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    wishlistId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    product: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        basePrice: number;
        imageUrl?: string;
        isActive: boolean;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
    };

    @ApiProperty()
    createdAt: Date;
}
