import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Aloe Vera Serum' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Hydrating serum', required: false })
  @IsString()
  description: string;

  @ApiProperty({ example: 19.99 })
  @IsNumber()
  basePrice: number;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ example: 'cmi4bjzoh0000i0k0epxskygh', required: false })
  @IsOptional()
  @IsString()
  primaryCategoryId?: string | null;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryCategoryIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  stock?: number;
}
