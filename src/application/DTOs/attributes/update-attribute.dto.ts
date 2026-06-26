import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';  
export class UpdateAttributeDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()  
    name?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()         
    type?: string;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    isRequired?: boolean;
}