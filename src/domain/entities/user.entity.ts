import { ProfileEntity } from "./profile.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserSubscriptionEntity } from "./subscription.entity";
import { AnalyzerEntity } from "./analyzer.entity";
import { PricingPlan } from "./pricing-plan.entity";

export class UserEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty()
    sex: string;

    @ApiProperty()
    phoneNo: string;
    

    @ApiProperty({ required: false })
    nationality?: string;

    @ApiProperty({ required: false })
    password?: string;

    @ApiProperty({ required: false })
    refreshToken?: string;

    @ApiProperty({ required: false })
    resetToken?: string;

    @ApiProperty({ required: false })
    resetTokenExpiry?: Date;

    @ApiProperty({ required: false })
    deletedAt?: Date;

    @ApiProperty({ required: false })
    lastLoginAt?: Date;

    // 🛡️ RE-ENFORCED: Root level flag for Dashboard Gatekeeper
    @ApiProperty({ required: false })
    onboardingCompleted?: boolean;

    @ApiProperty({ required: false })
    hasCompletedOnboarding?: boolean;

    @ApiProperty({ type: () => ProfileEntity })
    profile?: ProfileEntity;

    @ApiProperty({ type: () => UserSubscriptionEntity })
    subscription?: UserSubscriptionEntity;

    @ApiProperty({ type: () => PricingPlan })
    plan?: PricingPlan;
    
    @ApiProperty({ type: () => AnalyzerEntity})
    analyzer?: AnalyzerEntity;

    @ApiProperty({ type: () => [AnalyzerEntity], required: false })
    analyzers?: AnalyzerEntity[];

    @ApiProperty({ required: false })
    totalRemainingSessions?: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}