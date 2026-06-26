import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class UserContextDto {
  @Expose()
  @ApiProperty({ example: 'North America', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @Expose()
  @ApiProperty({ example: 'United States', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @Expose()
  @ApiProperty({ example: 'tan', required: false })
  @IsOptional()
  @IsString()
  known_skintone_type?: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString()
  skin_type_last_time_checked?: string;

  @Expose()
  @ApiProperty({ example: 'none', required: false })
  @IsOptional()
  @IsString()
  known_skin_condition?: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString()
  skin_condition_last_time_checked?: string;

  @Expose()
  @ApiProperty({ enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @Expose()
  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

  @Expose()
  @ApiProperty({ example: 'Nivea Soft', required: false })
  @IsOptional()
  @IsString()
  known_body_lotion?: string;

  @Expose()
  @ApiProperty({ example: 'Nivea', required: false })
  @IsOptional()
  @IsString()
  known_body_lotion_brand?: string;

  @Expose()
  @ApiProperty({ type: [String], example: ['nickel', 'fragrance'], required: false })
  @IsOptional()
  @IsArray()
  known_allergies?: string[];

  @Expose()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString()
  known_last_skin_treatment?: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  @IsOptional()
  @IsDateString()
  known_last_consultation_with_afridermatologists?: string;

  @Expose()
  @ApiProperty({ enum: ['inactive', 'low', 'moderate', 'high', 'very_high'], required: false })
  @IsOptional()
  @IsString()
  user_activeness_on_app?: string;
}

export class ChatbotRequestDto {
  @Expose()
  @ApiProperty({ example: 'What products are good for oily skin?' })
  @IsNotEmpty()
  @IsString()
  query: string;

  @Expose()
  @ApiProperty({ type: UserContextDto, required: false })
  @IsOptional()
  @Type(() => UserContextDto)
  @ValidateNested()
  more_info?: UserContextDto;
}

export class ChatbotResponseDto {
  @Expose()
  @ApiProperty({ example: 'success' })
  status: string;

  @Expose()
  @ApiProperty({ example: 'Here are some recommendations for oily skin...' })
  response: string;
}
