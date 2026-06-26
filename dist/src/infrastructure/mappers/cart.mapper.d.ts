import { CartEntity } from 'src/domain/entities/cart.entity';
export declare class CartMapper {
    static toDomain(raw: any): CartEntity;
    static toPrisma(entity: CartEntity): {
        id: string;
        userId: string;
        items: {
            create: {
                productId: string;
                quantity: number;
            }[];
        };
    };
}
