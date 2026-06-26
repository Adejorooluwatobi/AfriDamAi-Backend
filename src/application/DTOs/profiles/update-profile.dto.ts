import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsNumber, IsString, IsBoolean } from "class-validator";
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";

export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    ageRange?: number;

    // @ApiProperty({ required: false, type: [AnalyzerEntity] })
    // @IsArray()
    // @IsOptional()
    // skinHistory?: AnalyzerEntity[];
    
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
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

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    knownSkinAllergies?: string[];

    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    previousTreatments?: string[];

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    onboardingSkipped?: boolean;
}