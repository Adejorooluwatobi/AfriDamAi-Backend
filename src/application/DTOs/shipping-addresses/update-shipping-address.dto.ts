import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateShippingAddressDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    zipCode?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}