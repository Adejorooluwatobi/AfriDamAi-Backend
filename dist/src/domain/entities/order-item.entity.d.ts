import { ProductEntity } from "./product.entity";
export declare class OrderItemEntity {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product?: ProductEntity;
    constructor(partial: Partial<OrderItemEntity>);
}
