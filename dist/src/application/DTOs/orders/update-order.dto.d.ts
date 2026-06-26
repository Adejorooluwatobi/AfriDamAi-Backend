import { OrderStatus } from 'src/domain/entities/order.entity';
export declare class UpdateOrderDto {
    status?: OrderStatus;
    totalAmount?: number;
    shippingAddress?: string;
}
