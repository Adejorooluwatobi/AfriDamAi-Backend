import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { Consultation } from "@prisma/client";
export declare class ConsultationMapper {
    static toDomain(prismaConsultation: Consultation): ConsultationEntity;
    static toPrisma(consultation: ConsultationEntity): Omit<Consultation, 'createdAt' | 'updatedAt'>;
}
