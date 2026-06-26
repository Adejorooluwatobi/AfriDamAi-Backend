import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpecialistStatus, SpecialistType } from '@prisma/client';

export class CreateSpecialistDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sex: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string; // Password is handled separately in the service for hashing

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  documents?: string[]; // Added documents field

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarUrl?: string; // Optional field for specialist avatar

  @ApiProperty({ enum: SpecialistType })
  @IsNotEmpty()
  @IsEnum(SpecialistType)
  type: SpecialistType;
}
