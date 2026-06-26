import { SpecialistStatus, SpecialistType } from "@prisma/client";
export declare class SpecialistEntity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    nationality?: string;
    sex: string;
    avatarUrl?: string;
    password?: string;
    refreshToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastLoginAt?: Date;
    documents?: string[];
    status: SpecialistStatus;
    isActive: boolean;
    isSuspended: boolean;
    type: SpecialistType;
    completedAppointments: number;
    createdAt: Date;
    updatedAt: Date;
    organizationId?: string;
    constructor(partial: Partial<SpecialistEntity>);
}
