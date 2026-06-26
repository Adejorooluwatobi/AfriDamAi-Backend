import { ProductEntity } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class WishlistItemEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    wishlistId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty({ type: () => ProductEntity, required: false })
    product?: ProductEntity;

    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<WishlistItemEntity>) {
        Object.assign(this, partial);
    }
}