import { ProfileEntity } from "src/domain/entities/profile.entity";
import { ApiProperty } from "@nestjs/swagger";
import { SpecialistStatus, SpecialistType } from "@prisma/client";
import { UserSubscriptionEntity } from "src/domain/entities/subscription.entity";
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";

export class ApiResponseDto<T> {
  data: T;
  message: string;
  statusCode: number;

  constructor(data: T, message: string, statusCode: number = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class UserResponseDto {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    // 🛡️ RE-ENFORCED
    onboardingCompleted: boolean;
    
    constructor(id: string, email: string, role: string, isVerified: boolean, onboardingCompleted: boolean = false) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.isVerified = isVerified;
        this.onboardingCompleted = onboardingCompleted;
    }
}

export class PaginatedResponseDto<T> {
  items: T[];
    total: number;
    page: number;
    pageSize: number;
    constructor(items: T[], total: number, page: number, pageSize: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}

export class ErrorResponseDto {
  error: string;
  message: string;
  statusCode: number;

  constructor(error: string, message: string, statusCode: number = 400) {
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class SecureUserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    sex: string;

    @ApiProperty()
    phoneNo: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ required: false, nullable: true })
    lastLoginAt?: Date | null;

    // 🛡️ RE-ENFORCED: Syncing onboarding status to stop Mapper errors
    @ApiProperty()
    onboardingCompleted: boolean;

    @ApiProperty({ type: () => ProfileEntity, nullable: true })
    profile: ProfileEntity | null;

    @ApiProperty({ type: () => UserSubscriptionEntity, nullable: true })
    subscription: UserSubscriptionEntity | null;

    @ApiProperty({ required: false })
    plan?: any; // Use 'any' or PricingPlan type to avoid circular dependency hell if possible, but ideally PricingPlan.

    // @ApiProperty({ type: () => AnalyzerEntity, nullable: true })
    // analyzer: AnalyzerEntity | null;

    @ApiProperty({ type: () => [AnalyzerEntity], nullable: true })
    analyzers: AnalyzerEntity[] | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class SecureAdminResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName?: string;

    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    username?: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ required: false, nullable: true })
    lastLoginAt?: Date | null;

    @ApiProperty()
    phoneNo?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

import { Wallet } from "src/domain/entities/wallet.entity";

export class SecureVendorResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    companyName: string;

    @ApiProperty()
    rcNumber: string;

    @ApiProperty()
    businessAddress: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    documentsUrl: string[];

    @ApiProperty()
    status: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ required: false, nullable: true })
    lastLoginAt?: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => Wallet, nullable: true, description: 'Vendor Wallet information' })
    wallet: Wallet | null;
}

export class SecureSpecialistResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    sex: string;

    @ApiProperty()
    documents: string[];

    @ApiProperty({ enum: SpecialistType })
    type: SpecialistType;

    @ApiProperty({ enum: SpecialistStatus })
    status: SpecialistStatus;

    @ApiProperty()
    phoneNo: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ required: false, nullable: true })
    lastLoginAt?: Date | null;

    @ApiProperty({ description: 'Number of completed appointments' })
    completedAppointments: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    avatarUrl?: string; // Added avatarUrl

    @ApiProperty({ required: false })
    organizationId?: string;

    @ApiProperty({ type: () => Wallet, nullable: true, description: 'Specialist Wallet information' })
    wallet: Wallet | null;
}
