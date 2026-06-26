import type { CartRepositoryInterface } from '../repositories/cart.repository.interface';
import { CreateCartItemParams } from 'src/utils/type';
import { CartEntity } from '../entities/cart.entity';
export declare class CartService {
    private readonly cartRepository;
    private readonly logger;
    constructor(cartRepository: CartRepositoryInterface);
    getCartByUser(userId: string): Promise<CartEntity | null>;
    addItem(userId: string, params: CreateCartItemParams): Promise<CartEntity | null>;
    updateItem(userId: string, params: CreateCartItemParams): Promise<CartEntity | null>;
    removeItem(userId: string, itemId: string): Promise<CartEntity>;
    clearCart(userId: string): Promise<CartEntity>;
    createCart(userId: string): Promise<CartEntity>;
}
