import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { ConsultationRepositoryInterface } from "src/domain/repositories/consultation.interface";
import { CreateConsultationParams, UpdateConsultationParams } from "src/utils/type";
import { PrismaService } from "./prisma.service";
export declare class PrismaConsultationRepository implements ConsultationRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(consultation: CreateConsultationParams): Promise<ConsultationEntity>;
    findById(id: string): Promise<ConsultationEntity | null>;
    findAll(): Promise<ConsultationEntity[]>;
    update(id: string, consultation: UpdateConsultationParams): Promise<ConsultationEntity>;
    delete(id: string): Promise<void>;
}
