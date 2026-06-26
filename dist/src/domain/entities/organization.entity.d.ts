import { OrganizationStatus } from "@prisma/client";
export declare class OrganizationEntity {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    logoUrl?: string;
    brandingColors?: any;
    licenseUrl?: string;
    licenseNumber?: string;
    status: OrganizationStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<OrganizationEntity>);
}
