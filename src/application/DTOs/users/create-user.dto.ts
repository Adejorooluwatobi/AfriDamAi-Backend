import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    sex: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    nationality?: string;

    @ApiProperty()
    @IsString()
    phoneNo: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

}