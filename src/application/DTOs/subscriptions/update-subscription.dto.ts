import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  remainingSessions?: number; 

  @ApiProperty({ required: false, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'EXPIRED', 'CANCELLED'])
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
