import { WishlistItemEntity } from "./wishlist-item.entity";
export declare class WishlistEntity {
    id: string;
    userId: string;
    items: WishlistItemEntity[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<WishlistEntity>);
}
