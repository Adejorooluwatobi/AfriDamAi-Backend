import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductAttributeDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty()
    @IsString()
    attributeId: string;

    @ApiProperty()
    @IsString()
    attributeValueId: string;
}