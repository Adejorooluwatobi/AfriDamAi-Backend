import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateAttributeValueDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    value?: string;
}