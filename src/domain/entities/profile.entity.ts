import { AnalyzerEntity } from "./analyzer.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string

    @ApiProperty({ required: false })
    ageRange?: number;

    @ApiProperty({ type: [AnalyzerEntity], required: false })
    skinHistory?: AnalyzerEntity[];

    @ApiProperty({ required: false })
    skinType?: string;

    // 🛡️ RE-ENFORCED: Melanin-Specific Profile Data
    @ApiProperty({ required: false })
    melaninTone?: string;

    @ApiProperty({ required: false })
    primaryConcern?: string;

    @ApiProperty({ required: false })
    environment?: string;

    @ApiProperty({ required: false })
    avatarUrl?: string;

    // 🛡️ RE-ENFORCED: Onboarding Sync Flags
    @ApiProperty({ required: false })
    onboardingCompleted?: boolean;

    @ApiProperty({ required: false })
    hasCompletedOnboarding?: boolean;

    @ApiProperty({ required: false, description: 'Fitzpatrick scale (1-6)' })
    skinToneLevel?: number;

    @ApiProperty({ type: [String], required: false })
    knownSkinAllergies?: string[];

    @ApiProperty({ required: false })
    allergies?: string; // Standard string storage for the textarea data

    @ApiProperty({ type: [String], required: false })
    previousTreatments?: string[];

    @ApiProperty({ required: false, description: 'Whether user skipped onboarding' })
    onboardingSkipped?: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<ProfileEntity>) {
        Object.assign(this, partial);
    }   
}