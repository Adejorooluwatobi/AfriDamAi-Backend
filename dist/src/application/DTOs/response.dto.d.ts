import { ProfileEntity } from "src/domain/entities/profile.entity";
import { SpecialistStatus, SpecialistType } from "@prisma/client";
import { UserSubscriptionEntity } from "src/domain/entities/subscription.entity";
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";
export declare class ApiResponseDto<T> {
    data: T;
    message: string;
    statusCode: number;
    constructor(data: T, message: string, statusCode?: number);
}
export declare class UserResponseDto {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    onboardingCompleted: boolean;
    constructor(id: string, email: string, role: string, isVerified: boolean, onboardingCompleted?: boolean);
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    constructor(items: T[], total: number, page: number, pageSize: number);
}
export declare class ErrorResponseDto {
    error: string;
    message: string;
    statusCode: number;
    constructor(error: string, message: string, statusCode?: number);
}
export declare class SecureUserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    sex: string;
    phoneNo: string;
    isActive: boolean;
    isSuspended: boolean;
    lastLoginAt?: Date | null;
    onboardingCompleted: boolean;
    profile: ProfileEntity | null;
    subscription: UserSubscriptionEntity | null;
    plan?: any;
    analyzers: AnalyzerEntity[] | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SecureAdminResponseDto {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    type: string;
    isActive: boolean;
    isSuspended: boolean;
    lastLoginAt?: Date | null;
    phoneNo?: string;
    createdAt: Date;
    updatedAt: Date;
}
import { Wallet } from "src/domain/entities/wallet.entity";
export declare class SecureVendorResponseDto {
    id: string;
    companyName: string;
    rcNumber: string;
    businessAddress: string;
    phoneNumber: string;
    email: string;
    documentsUrl: string[];
    status: string;
    isActive: boolean;
    isSuspended: boolean;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    wallet: Wallet | null;
}
export declare class SecureSpecialistResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    sex: string;
    documents: string[];
    type: SpecialistType;
    status: SpecialistStatus;
    phoneNo: string;
    isActive: boolean;
    isSuspended: boolean;
    lastLoginAt?: Date | null;
    completedAppointments: number;
    createdAt: Date;
    updatedAt: Date;
    avatarUrl?: string;
    organizationId?: string;
    wallet: Wallet | null;
}
