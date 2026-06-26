import { CartEntity } from 'src/domain/entities/cart.entity';
import { CartItemEntity } from 'src/domain/entities/cart-item.entity';


export class CartMapper {
    static toDomain(raw: any): CartEntity {
       return new CartEntity({
      id: raw.id,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      items: raw.items?.map((item: any) =>
        new CartItemEntity({
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
        }),
      ) || [],
    });
    }

     static toPrisma(entity: CartEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      items: entity.items?.length
        ? {
            create: entity.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }
        : undefined,
    };
  }
}