import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreateVendorDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rcNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    businessAddress: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    documentsUrl?: string[];

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

}