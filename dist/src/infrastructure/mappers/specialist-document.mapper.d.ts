import { SpecialistDocument } from '@prisma/client';
import { SpecialistDocumentEntity } from 'src/domain/entities/specialist-document.entity';
export declare class SpecialistDocumentMapper {
    static toDomain(raw: SpecialistDocument): SpecialistDocumentEntity;
    static toDomainArray(raws: SpecialistDocument[]): SpecialistDocumentEntity[];
    static toPersistence(domain: Partial<SpecialistDocumentEntity>): {
        personalAddress: string;
        city: string;
        state: string;
        country: string;
        licenseNumber: string;
        licenseUrl: string;
        yearsExperience: number;
        specialization: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
        bankCode: string;
    };
}
