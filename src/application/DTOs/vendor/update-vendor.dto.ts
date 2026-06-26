import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength, IsArray, IsEnum } from "class-validator";
import { VendorStatus } from "src/domain/entities/vendor.entity";

export class UpdateVendorDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    companyName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    rcNumber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    businessAddress?: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    documentsUrl?: string[];

    @ApiProperty({ enum: VendorStatus })
    @IsOptional()
    status?: VendorStatus;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

}