import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsString } from "class-validator";

export class UpdateConsultationDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}