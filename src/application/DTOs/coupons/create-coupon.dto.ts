import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsIn } from 'class-validator';

export class CreateCouponDto {
    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    @IsIn(['PERCENTAGE', 'FIXED'])
    discountType: 'PERCENTAGE' | 'FIXED';

    @ApiProperty()
    @IsNumber()
    discountValue: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    minOrderAmount?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    maxUses?: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    expiresAt?: Date;
}