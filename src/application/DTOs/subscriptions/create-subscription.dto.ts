import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDateString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  planId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string; // Made optional

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string; // Already optional, just reordering decorators

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
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
