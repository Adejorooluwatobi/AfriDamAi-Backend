"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistDocumentMapper = void 0;
const specialist_document_entity_1 = require("../../domain/entities/specialist-document.entity");
class SpecialistDocumentMapper {
    static toDomain(raw) {
        return new specialist_document_entity_1.SpecialistDocumentEntity({
            id: raw.id,
            specialistId: raw.specialistId,
            personalAddress: raw.personalAddress ?? undefined,
            city: raw.city ?? undefined,
            state: raw.state ?? undefined,
            country: raw.country ?? undefined,
            licenseNumber: raw.licenseNumber ?? undefined,
            licenseUrl: raw.licenseUrl ?? undefined,
            yearsExperience: raw.yearsExperience ?? undefined,
            specialization: raw.specialization ?? undefined,
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
            personalAddress: domain.personalAddress ?? null,
            city: domain.city ?? null,
            state: domain.state ?? null,
            country: domain.country ?? null,
            licenseNumber: domain.licenseNumber ?? null,
            licenseUrl: domain.licenseUrl ?? null,
            yearsExperience: domain.yearsExperience ?? null,
            specialization: domain.specialization ?? null,
            bankName: domain.bankName ?? null,
            accountName: domain.accountName ?? null,
            accountNumber: domain.accountNumber ?? null,
            bankCode: domain.bankCode ?? null,
        };
    }
}
exports.SpecialistDocumentMapper = SpecialistDocumentMapper;
//# sourceMappingURL=specialist-document.mapper.js.map