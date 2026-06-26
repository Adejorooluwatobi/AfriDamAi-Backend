export declare enum AdminType {
    SUPER_ADMIN = "SUPER_ADMIN",
    MEDICAL_REVIEWER = "MEDICAL_REVIEWER",
    OPERATIONS_ADMIN = "OPERATIONS_ADMIN",
    VENDOR_MANAGER = "VENDOR_MANAGER",
    FINANCE_ADMIN = "FINANCE_ADMIN",
    FACILITY_ADMIN = "FACILITY_ADMIN"
}
export declare class AdminEntity {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    isActive: boolean;
    isSuspended: boolean;
    type: AdminType;
    phoneNo?: string;
    password: string;
    refreshToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    organizationId?: string;
}
