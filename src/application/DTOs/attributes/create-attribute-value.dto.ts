import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAttributeValueDto {
    @IsString()
    @ApiProperty()
    attributeId: string;

    @IsString()
    @ApiProperty()
    value: string;
}