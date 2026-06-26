export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    sex?: string;
    phoneNo?: string;
    password?: string;
    onboardingCompleted?: boolean;
    hasCompletedOnboarding?: boolean;
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
