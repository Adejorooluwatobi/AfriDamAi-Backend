import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, IsObject } from "class-validator";

export class UpdateUserDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    sex?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phoneNo?: string;

    @ApiProperty({ required: false })
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    // 🛡️ RE-ENFORCED: Root Level Onboarding Persistence
    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    onboardingCompleted?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    hasCompletedOnboarding?: boolean; 

    // 🛡️ RE-ENFORCED: Nested Clinical Profile Data
    @ApiProperty({ 
        required: false,
        example: { 
            skinType: "Oily", 
            melaninTone: "Deep", 
            primaryConcern: "Hyperpigmentation",
            environment: "Urban/Polluted",
            allergies: "Fragrance, Essential Oils",
            avatarUrl: "https://storage.googleapis.com/afridam/avatar.jpg"
        } 
    })
    @IsObject()
    @IsOptional()
    profile?: {
        skinType?: string;
        melaninTone?: string;
        primaryConcern?: string;
        environment?: string;
        allergies?: string;
        bio?: string;
        avatarUrl?: string;
        onboardingCompleted?: boolean;
    };
}