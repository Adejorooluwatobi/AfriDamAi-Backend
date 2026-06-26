import { VendorDocumentEntity } from '../entities/vendor-document.entity';
export interface IVendorDocumentRepository {
    findByVendorId(vendorId: string): Promise<VendorDocumentEntity | null>;
    upsert(vendorId: string, data: Partial<VendorDocumentEntity>): Promise<VendorDocumentEntity>;
}
