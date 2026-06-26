import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { UserContextDto } from './chatbot.dto';

export class IngredientsAnalysisRequestDto {
  @Expose()
  @ApiProperty({ example: 'Water, Glycerin, Cetyl Alcohol, Stearic Acid' })
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

export class IngredientsAnalysisResponseDto {
  @Expose()
  @ApiProperty({ example: 'success' })
  status: string;

  @Expose()
  @ApiProperty({ example: 'The product contains safe ingredients...' })
  response: string;
}
