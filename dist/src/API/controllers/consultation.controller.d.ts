import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { ConsultationService } from "src/domain/services/consultation.service";
import { CreateConsultationDto } from "src/application/DTOs/consultation/create-consultation.dto";
import { UpdateConsultationDto } from "src/application/DTOs/consultation/update-consultation.dto";
export declare class ConsultationController {
    private readonly consultationService;
    constructor(consultationService: ConsultationService);
    create(createConsultationDto: CreateConsultationDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ConsultationEntity;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ConsultationEntity[];
    }>;
    findById(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ConsultationEntity;
    }>;
    update(id: string, updateConsultationDto: UpdateConsultationDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ConsultationEntity;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: {
            id: string;
        };
    }>;
}
