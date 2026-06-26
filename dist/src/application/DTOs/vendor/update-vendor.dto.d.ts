import { VendorStatus } from "src/domain/entities/vendor.entity";
export declare class UpdateVendorDto {
    companyName?: string;
    rcNumber?: string;
    businessAddress?: string;
    email?: string;
    phoneNumber?: string;
    documentsUrl?: string[];
    status?: VendorStatus;
    password?: string;
}
