export declare enum VendorStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED",
    REJECTED = "REJECTED"
}
export declare class VendorEntity {
    id: string;
    email: string;
    companyName: string;
    rcNumber: string;
    businessAddress: string;
    phoneNumber: string;
    documentsUrl?: string[];
    status: VendorStatus;
    isActive: boolean;
    isSuspended: boolean;
    password?: string;
    refreshToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<VendorEntity>);
}
