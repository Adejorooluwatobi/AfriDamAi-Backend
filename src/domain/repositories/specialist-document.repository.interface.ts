import { SpecialistDocumentEntity } from '../entities/specialist-document.entity';

export interface ISpecialistDocumentRepository {
  findBySpecialistId(specialistId: string): Promise<SpecialistDocumentEntity | null>;
  upsert(specialistId: string, data: Partial<SpecialistDocumentEntity>): Promise<SpecialistDocumentEntity>;
}
