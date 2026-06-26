import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDto {
    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    price?: number;
}