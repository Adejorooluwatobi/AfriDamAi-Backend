import { OrganizationStatus } from '@prisma/client';
export declare class CreateOrganizationDto {
    name: string;
    email: string;
    phone: string;
    address?: string;
    logoUrl?: string;
    brandingColors?: any;
    licenseUrl?: string;
    licenseNumber?: string;
    status?: OrganizationStatus;
    isActive?: boolean;
}
declare const UpdateOrganizationDto_base: import("@nestjs/common").Type<Partial<CreateOrganizationDto>>;
export declare class UpdateOrganizationDto extends UpdateOrganizationDto_base {
}
export {};
