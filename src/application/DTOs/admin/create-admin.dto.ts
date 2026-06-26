import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { AdminType } from "src/domain/entities/admin.entity";

export class CreateAdminDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ enum: AdminType })
    @IsEnum(AdminType)
    type: AdminType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNo?: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

}