import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class OrderEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;

    @ApiProperty()
    totalAmount: number;

    @ApiProperty()
    shippingAddress: string;

    @ApiProperty({ type: [OrderItemEntity] })
    items: OrderItemEntity[];

    @ApiProperty({ type: () => UserEntity, required: false })
    user?: any;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<OrderEntity>) {
        Object.assign(this, partial);
    }
}