import { CartEntity } from '../entities/cart.entity';
import { CreateCartItemParams } from 'src/utils/type';
export interface CartRepositoryInterface {
    createCart(userId: string): Promise<CartEntity>;
    deleteCart(userId: string): Promise<void>;
    findCartByUserId(userId: string): Promise<CartEntity | null>;
    addItem(params: CreateCartItemParams): Promise<CartEntity>;
    updateItem(params: CreateCartItemParams): Promise<CartEntity>;
    removeItem(cartId: string, productId: string): Promise<void>;
    clearCart(cartId: string): Promise<void>;
}
