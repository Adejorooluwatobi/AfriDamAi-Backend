export declare class SpecialistDocumentEntity {
    id: string;
    specialistId: string;
    personalAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    licenseNumber?: string;
    licenseUrl?: string;
    yearsExperience?: number;
    specialization?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    bankCode?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<SpecialistDocumentEntity>);
}
