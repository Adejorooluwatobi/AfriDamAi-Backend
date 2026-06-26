import { WishlistItemEntity } from "./wishlist-item.entity";
import { ApiProperty } from "@nestjs/swagger";

export class WishlistEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: [WishlistItemEntity] })
    items: WishlistItemEntity[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<WishlistEntity>) {
        Object.assign(this, partial);
    }
}