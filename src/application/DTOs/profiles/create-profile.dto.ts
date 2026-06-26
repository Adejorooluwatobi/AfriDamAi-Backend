import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";

export class CreateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ageRange?: number;

  // @ApiProperty({ required: false, type: [AnalyzerEntity] })
  // @IsArray()
  // @IsOptional()
  // skinHistory?: AnalyzerEntity[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  skinType?: string;

  // 🛡️ RE-ENFORCED: Melanin-Specific Fields for Clinical Sync
  @ApiProperty({ required: false, example: 'Deep Melanin' })
  @IsString()
  @IsOptional()
  melaninTone?: string;

  @ApiProperty({ required: false, example: 'Hyperpigmentation' })
  @IsString()
  @IsOptional()
  primaryConcern?: string;

  @ApiProperty({ required: false, example: 'High Humidity' })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  allergies?: string; // Textarea version for raw notes

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  onboardingCompleted?: boolean;

  @ApiProperty({ required: false, description: 'Fitzpatrick scale (1-6)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  skinToneLevel?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  knownSkinAllergies?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousTreatments?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  onboardingSkipped?: boolean;
}
