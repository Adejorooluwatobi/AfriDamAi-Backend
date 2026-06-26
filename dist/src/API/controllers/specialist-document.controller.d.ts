import { SpecialistDocumentService } from 'src/domain/services/specialist-document.service';
import { UpsertSpecialistDocumentDto } from 'src/application/DTOs/documents/upsert-specialist-document.dto';
export declare class SpecialistDocumentController {
    private readonly specialistDocumentService;
    constructor(specialistDocumentService: SpecialistDocumentService);
    getMyDocument(req: any): Promise<import("../../domain/entities/specialist-document.entity").SpecialistDocumentEntity>;
    upsertMyDocument(req: any, dto: UpsertSpecialistDocumentDto): Promise<import("../../domain/entities/specialist-document.entity").SpecialistDocumentEntity>;
}
