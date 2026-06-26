import { CartItemEntity } from './cart-item.entity';
export declare class CartEntity {
    id: string;
    userId: string;
    items: CartItemEntity[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CartEntity>);
    addItem(productId: string, quantity?: number): CartItemEntity;
    updateQuantity(productId: string, quantity: number): void;
    removeItem(productId: string): void;
    clear(): void;
}
