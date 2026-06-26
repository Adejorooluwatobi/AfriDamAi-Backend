"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorDocumentMapper = void 0;
const vendor_document_entity_1 = require("../../domain/entities/vendor-document.entity");
class VendorDocumentMapper {
    static toDomain(raw) {
        return new vendor_document_entity_1.VendorDocumentEntity({
            id: raw.id,
            vendorId: raw.vendorId,
            businessRegUrl: raw.businessRegUrl ?? undefined,
            taxIdNumber: raw.taxIdNumber ?? undefined,
            cacDocumentUrl: raw.cacDocumentUrl ?? undefined,
            directorName: raw.directorName ?? undefined,
            directorAddress: raw.directorAddress ?? undefined,
            bankName: raw.bankName ?? undefined,
            accountName: raw.accountName ?? undefined,
            accountNumber: raw.accountNumber ?? undefined,
            bankCode: raw.bankCode ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map(r => this.toDomain(r));
    }
    static toPersistence(domain) {
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
exports.VendorDocumentMapper = VendorDocumentMapper;
//# sourceMappingURL=vendor-document.mapper.js.map