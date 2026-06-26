import { CartRepositoryInterface } from 'src/domain/repositories/cart.repository.interface';
import { CartEntity } from 'src/domain/entities/cart.entity';
import { CreateCartItemParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaCartRepository implements CartRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    createCart(userId: string): Promise<CartEntity>;
    deleteCart(userId: string): Promise<void>;
    findCartByUserId(userId: string): Promise<CartEntity | null>;
    addItem(params: CreateCartItemParams): Promise<CartEntity>;
    updateItem(params: CreateCartItemParams): Promise<CartEntity>;
    removeItem(cartId: string, productId: string): Promise<void>;
    clearCart(cartId: string): Promise<void>;
}
