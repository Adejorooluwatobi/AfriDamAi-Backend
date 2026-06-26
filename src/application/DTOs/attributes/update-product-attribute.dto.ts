import { IsString, IsOptional } from 'class-validator';

export class UpdateProductAttributeDto {
    @IsOptional()
    @IsString()
    attributeValueId?: string;
}