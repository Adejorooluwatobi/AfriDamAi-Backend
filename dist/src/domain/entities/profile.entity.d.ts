import { AnalyzerEntity } from "./analyzer.entity";
export declare class ProfileEntity {
    id: string;
    userId: string;
    ageRange?: number;
    skinHistory?: AnalyzerEntity[];
    skinType?: string;
    melaninTone?: string;
    primaryConcern?: string;
    environment?: string;
    avatarUrl?: string;
    onboardingCompleted?: boolean;
    hasCompletedOnboarding?: boolean;
    skinToneLevel?: number;
    knownSkinAllergies?: string[];
    allergies?: string;
    previousTreatments?: string[];
    onboardingSkipped?: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ProfileEntity>);
}
