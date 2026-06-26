import { CreateConsultationParams, UpdateConsultationParams } from "src/utils/type";
import { ConsultationEntity } from "../entities/consultation.entity";
export interface ConsultationRepositoryInterface {
    create(consultation: CreateConsultationParams): Promise<ConsultationEntity>;
    findById(id: string): Promise<ConsultationEntity | null>;
    findAll(): Promise<ConsultationEntity[]>;
    update(id: string, consultation: UpdateConsultationParams): Promise<ConsultationEntity>;
    delete(id: string): Promise<void>;
}
