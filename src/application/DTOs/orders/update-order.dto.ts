import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from 'src/domain/entities/order.entity';

export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsNumber()
    totalAmount?: number;

    @IsOptional()
    @IsString()
    shippingAddress?: string;
}