import { VendorDocumentService } from 'src/domain/services/vendor-document.service';
import { UpsertVendorDocumentDto } from 'src/application/DTOs/documents/upsert-vendor-document.dto';
export declare class VendorDocumentController {
    private readonly vendorDocumentService;
    constructor(vendorDocumentService: VendorDocumentService);
    getMyDocument(req: any): Promise<import("../../domain/entities/vendor-document.entity").VendorDocumentEntity>;
    upsertMyDocument(req: any, dto: UpsertVendorDocumentDto): Promise<import("../../domain/entities/vendor-document.entity").VendorDocumentEntity>;
}
