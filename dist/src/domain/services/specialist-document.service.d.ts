import { ISpecialistDocumentRepository } from '../repositories/specialist-document.repository.interface';
import { SpecialistDocumentEntity } from '../entities/specialist-document.entity';
export declare class SpecialistDocumentService {
    private readonly repo;
    constructor(repo: ISpecialistDocumentRepository);
    getDocument(specialistId: string): Promise<SpecialistDocumentEntity>;
    upsertDocument(specialistId: string, data: Partial<SpecialistDocumentEntity>): Promise<SpecialistDocumentEntity>;
}
