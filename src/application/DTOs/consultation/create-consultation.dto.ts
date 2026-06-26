import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateConsultationDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    title: string;
    
    @ApiProperty()
    @IsString()
    description: string;
}