import { CartItemEntity } from 'src/domain/entities/cart-item.entity';
import { CartItem } from '@prisma/client';
export declare class CartItemMapper {
    static toDomain(prismaCartItem: CartItem): CartItemEntity;
    static toPrisma(cartItem: CartItemEntity): CartItem;
}
