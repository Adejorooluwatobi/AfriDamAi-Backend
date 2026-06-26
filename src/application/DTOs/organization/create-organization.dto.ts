import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsPhoneNumber, IsEnum, IsBoolean } from 'class-validator';
import { OrganizationStatus } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'St. Lawrence Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'contact@stlawrence.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: false, example: '123 Medical Way, Lagos' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false, description: 'JSON object with branding colors' })
  @IsOptional()
  brandingColors?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  licenseUrl?: string;

  @ApiProperty({ required: false, example: 'MDC-123456' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({ enum: OrganizationStatus, required: false, default: OrganizationStatus.PENDING })
  @IsEnum(OrganizationStatus)
  @IsOptional()
  status?: OrganizationStatus;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
