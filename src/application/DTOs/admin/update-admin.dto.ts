import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { AdminType } from "src/domain/entities/admin.entity";

export class UpdateAdminDto {

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
    @IsOptional()
    email?: string;

    @ApiProperty({ enum: AdminType })
    @IsEnum(AdminType)
    @IsOptional()
    type?: AdminType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNo?: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

}