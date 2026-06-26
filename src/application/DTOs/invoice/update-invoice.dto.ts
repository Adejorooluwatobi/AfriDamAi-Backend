import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateInvoiceDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    issueDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    taxAmount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    discountAmount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    netAmount?: number;
}
