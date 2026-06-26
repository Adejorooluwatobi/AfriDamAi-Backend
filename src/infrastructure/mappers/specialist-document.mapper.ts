import { SpecialistDocument } from '@prisma/client';
import { SpecialistDocumentEntity } from 'src/domain/entities/specialist-document.entity';

export class SpecialistDocumentMapper {
  static toDomain(raw: SpecialistDocument): SpecialistDocumentEntity {
    return new SpecialistDocumentEntity({
      id: raw.id,
      specialistId: raw.specialistId,

      // Personal Info
      personalAddress: raw.personalAddress ?? undefined,
      city: raw.city ?? undefined,
      state: raw.state ?? undefined,
      country: raw.country ?? undefined,

      // Professional Info
      licenseNumber: raw.licenseNumber ?? undefined,
      licenseUrl: raw.licenseUrl ?? undefined,
      yearsExperience: raw.yearsExperience ?? undefined,
      specialization: raw.specialization ?? undefined,

      // Bank Details
      bankName: raw.bankName ?? undefined,
      accountName: raw.accountName ?? undefined,
      accountNumber: raw.accountNumber ?? undefined,
      bankCode: raw.bankCode ?? undefined,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toDomainArray(raws: SpecialistDocument[]): SpecialistDocumentEntity[] {
    return raws.map(r => this.toDomain(r));
  }

  static toPersistence(domain: Partial<SpecialistDocumentEntity>) {
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
