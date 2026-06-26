import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceItemDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    unitPrice: number;

    @ApiProperty()
    @IsNumber()
    totalPrice: number;
}

export class CreateInvoiceDto {
    @ApiProperty()
    @IsString()
    invoiceNumber: string;

    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    issueDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty()
    @IsNumber()
    totalAmount: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    taxAmount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    discountAmount?: number;

    @ApiProperty()
    @IsNumber()
    netAmount: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ type: [CreateInvoiceItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}
