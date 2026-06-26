"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationMapper = void 0;
class ConsultationMapper {
    static toDomain(prismaConsultation) {
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
    static toPrisma(consultation) {
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
exports.ConsultationMapper = ConsultationMapper;
//# sourceMappingURL=consultation.mapper.js.map