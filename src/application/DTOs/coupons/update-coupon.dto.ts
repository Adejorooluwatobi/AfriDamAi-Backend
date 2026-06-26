import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsIn } from 'class-validator';

export class UpdateCouponDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    @IsIn(['PERCENTAGE', 'FIXED'])
    discountType?: 'PERCENTAGE' | 'FIXED';

    @IsOptional()
    @IsNumber()
    discountValue?: number;

    @IsOptional()
    @IsNumber()
    minOrderAmount?: number;

    @IsOptional()
    @IsNumber()
    maxUses?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}