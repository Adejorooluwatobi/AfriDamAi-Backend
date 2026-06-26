import { ProductEntity } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class OrderItemEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    orderId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;

    @ApiProperty({ type: () => ProductEntity, required: false })
    product?: ProductEntity;

    constructor(partial: Partial<OrderItemEntity>) {
        Object.assign(this, partial);
    }
}