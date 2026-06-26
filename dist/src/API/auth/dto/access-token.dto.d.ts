import { AdminType, SpecialistType } from "@prisma/client";
export declare class UserAccessTokenDto {
    id: string;
    accessToken: string;
    isActive: boolean;
    displayName: string;
    role: string;
    refreshToken: string;
    plan: any;
}
export declare class AdminAccessTokenDto {
    id: string;
    accessToken: string;
    isActive: boolean;
    displayName: string;
    role: string;
    refreshToken: string;
    type: AdminType;
}
export declare class VendorAccessTokenDto {
    id: string;
    accessToken: string;
    isActive: boolean;
    displayName: string;
    role: string;
    refreshToken: string;
}
export declare class SpecialistAccessTokenDto {
    id: string;
    accessToken: string;
    isActive: boolean;
    displayName: string;
    role: string;
    refreshToken: string;
    type: SpecialistType;
}
