import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialistId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isGeneral?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdateNotificationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isRead?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isDelivered?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    readAt?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    deliveredAt?: Date;
}
