import { ProductEntity } from './product.entity';
export declare class CartItemEntity {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product?: ProductEntity;
    constructor(partial: Partial<CartItemEntity>);
}
