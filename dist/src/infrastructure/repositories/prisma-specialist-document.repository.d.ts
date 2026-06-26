import { PrismaService } from '../persistence/prisma/prisma.service';
import { ISpecialistDocumentRepository } from 'src/domain/repositories/specialist-document.repository.interface';
import { SpecialistDocumentEntity } from 'src/domain/entities/specialist-document.entity';
export declare class PrismaSpecialistDocumentRepository implements ISpecialistDocumentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findBySpecialistId(specialistId: string): Promise<SpecialistDocumentEntity | null>;
    upsert(specialistId: string, data: Partial<SpecialistDocumentEntity>): Promise<SpecialistDocumentEntity>;
}
