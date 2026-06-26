import { VendorDocument } from '@prisma/client';
import { VendorDocumentEntity } from 'src/domain/entities/vendor-document.entity';
export declare class VendorDocumentMapper {
    static toDomain(raw: VendorDocument): VendorDocumentEntity;
    static toDomainArray(raws: VendorDocument[]): VendorDocumentEntity[];
    static toPersistence(domain: Partial<VendorDocumentEntity>): {
        businessRegUrl: string;
        taxIdNumber: string;
        cacDocumentUrl: string;
        directorName: string;
        directorAddress: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        bankCode: string;
    };
}
