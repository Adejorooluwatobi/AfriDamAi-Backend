import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { Consultation } from "@prisma/client";

export class ConsultationMapper {
    static toDomain(prismaConsultation: Consultation): ConsultationEntity {
        return {
            id: prismaConsultation.id,
            name: prismaConsultation.name,
            email: prismaConsultation.email,
            phone: prismaConsultation.phone,
            title: prismaConsultation.title,
            description: prismaConsultation.description,
            createdAt: prismaConsultation.createdAt,
            updatedAt: prismaConsultation.updatedAt,
        };
    }

    static toPrisma(consultation: ConsultationEntity): Omit<Consultation, 'createdAt' | 'updatedAt'> {
        return {
            id: consultation.id,
            name: consultation.name,
            email: consultation.email,
            phone: consultation.phone,
            title: consultation.title,
            description: consultation.description,
        };
    }
}