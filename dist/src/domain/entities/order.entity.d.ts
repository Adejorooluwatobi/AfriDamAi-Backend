import { OrderItemEntity } from "./order-item.entity";
export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class OrderEntity {
    id: string;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: string;
    items: OrderItemEntity[];
    user?: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<OrderEntity>);
}
