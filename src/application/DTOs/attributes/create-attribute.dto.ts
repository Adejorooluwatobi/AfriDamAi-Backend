import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AttributeType {
    TEXT = 'text',
    SELECT = 'select',
    COLOR = 'color',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

export class CreateAttributeDto {
    @ApiProperty({ 
        description: 'Name of the attribute',
        example: 'Size'
    })
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'Type of the attribute',
        enum: AttributeType,
        example: AttributeType.SELECT
    })
    @IsEnum(AttributeType)
    type: AttributeType;

    @ApiPropertyOptional({ 
        description: 'Whether this attribute is required for products',
        default: false
    })
    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;
}
