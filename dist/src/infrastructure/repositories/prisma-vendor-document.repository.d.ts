import { PrismaService } from '../persistence/prisma/prisma.service';
import { IVendorDocumentRepository } from 'src/domain/repositories/vendor-document.repository.interface';
import { VendorDocumentEntity } from 'src/domain/entities/vendor-document.entity';
export declare class PrismaVendorDocumentRepository implements IVendorDocumentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByVendorId(vendorId: string): Promise<VendorDocumentEntity | null>;
    upsert(vendorId: string, data: Partial<VendorDocumentEntity>): Promise<VendorDocumentEntity>;
}
