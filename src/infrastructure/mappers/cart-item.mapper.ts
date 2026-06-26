import { CartItemEntity } from 'src/domain/entities/cart-item.entity';
import { CartItem } from '@prisma/client';

export class CartItemMapper {
    static toDomain(prismaCartItem: CartItem): CartItemEntity {
        return new CartItemEntity({
            id: prismaCartItem.id,
            cartId: prismaCartItem.cartId,
            productId: prismaCartItem.productId,
            quantity: prismaCartItem.quantity,
        });
    }

    static toPrisma(cartItem: CartItemEntity): CartItem {
        return {
            id: cartItem.id,
            cartId: cartItem.cartId,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
        };
    }
}