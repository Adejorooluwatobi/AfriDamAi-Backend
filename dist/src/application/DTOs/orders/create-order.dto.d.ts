export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    shippingAddress: string;
    items: CreateOrderItemDto[];
}
