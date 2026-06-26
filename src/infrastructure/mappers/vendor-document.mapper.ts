import { VendorDocument } from '@prisma/client';
import { VendorDocumentEntity } from 'src/domain/entities/vendor-document.entity';

export class VendorDocumentMapper {
  static toDomain(raw: VendorDocument): VendorDocumentEntity {
    return new VendorDocumentEntity({
      id: raw.id,
      vendorId: raw.vendorId,

      // Business Info
      businessRegUrl: raw.businessRegUrl ?? undefined,
      taxIdNumber: raw.taxIdNumber ?? undefined,
      cacDocumentUrl: raw.cacDocumentUrl ?? undefined,
      directorName: raw.directorName ?? undefined,
      directorAddress: raw.directorAddress ?? undefined,

      // Bank Details
      bankName: raw.bankName ?? undefined,
      accountName: raw.accountName ?? undefined,
      accountNumber: raw.accountNumber ?? undefined,
      bankCode: raw.bankCode ?? undefined,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toDomainArray(raws: VendorDocument[]): VendorDocumentEntity[] {
    return raws.map(r => this.toDomain(r));
  }

  static toPersistence(domain: Partial<VendorDocumentEntity>) {
    return {
      businessRegUrl: domain.businessRegUrl ?? null,
      taxIdNumber: domain.taxIdNumber ?? null,
      cacDocumentUrl: domain.cacDocumentUrl ?? null,
      directorName: domain.directorName ?? null,
      directorAddress: domain.directorAddress ?? null,
      bankName: domain.bankName ?? null,
      accountName: domain.accountName ?? null,
      accountNumber: domain.accountNumber ?? null,
      bankCode: domain.bankCode ?? null,
    };
  }
}
