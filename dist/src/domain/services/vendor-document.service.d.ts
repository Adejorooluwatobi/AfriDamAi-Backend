import { IVendorDocumentRepository } from '../repositories/vendor-document.repository.interface';
import { VendorDocumentEntity } from '../entities/vendor-document.entity';
export declare class VendorDocumentService {
    private readonly repo;
    constructor(repo: IVendorDocumentRepository);
    getDocument(vendorId: string): Promise<VendorDocumentEntity>;
    upsertDocument(vendorId: string, data: Partial<VendorDocumentEntity>): Promise<VendorDocumentEntity>;
}
