export declare class VendorDocumentEntity {
    id: string;
    vendorId: string;
    businessRegUrl?: string;
    taxIdNumber?: string;
    cacDocumentUrl?: string;
    directorName?: string;
    directorAddress?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    bankCode?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<VendorDocumentEntity>);
}
