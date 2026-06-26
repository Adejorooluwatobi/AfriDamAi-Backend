import { CartEntity } from 'src/domain/entities/cart.entity';
import { CreateCartDto } from 'src/application/DTOs/carts/create-cart.dto';
import { CreateCartItemDto } from 'src/application/DTOs/carts/create-cart-item.dto';
import { CartService } from 'src/domain/services/cart.service';
import { UpdateCartItemDto } from 'src/application/DTOs/carts/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(CreateCartDto: CreateCartDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
    findUser(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
    update(id: string, UpdateCartItemDto: UpdateCartItemDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
    addItem(userid: string, CreateCartItemDto: CreateCartItemDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
    clearCart(userId: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CartEntity;
    }>;
}
