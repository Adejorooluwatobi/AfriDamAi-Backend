import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
    @ApiProperty({ description: 'Product ID' })
    @IsString()
    productId: string;

    @ApiProperty({ description: 'Quantity of items' })
    @IsNumber()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'Shipping address' })
    @IsString()
    shippingAddress: string;

    @ApiProperty({ type: [CreateOrderItemDto], description: 'Order items' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}