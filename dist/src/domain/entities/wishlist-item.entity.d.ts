import { ProductEntity } from "./product.entity";
export declare class WishlistItemEntity {
    id: string;
    wishlistId: string;
    productId: string;
    product?: ProductEntity;
    createdAt: Date;
    constructor(partial: Partial<WishlistItemEntity>);
}
