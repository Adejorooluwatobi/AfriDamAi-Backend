import { Injectable } from "@nestjs/common";
import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { ConsultationRepositoryInterface } from "src/domain/repositories/consultation.interface";
import { CreateConsultationParams, UpdateConsultationParams } from "src/utils/type";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaConsultationRepository implements ConsultationRepositoryInterface {
    constructor(private prisma: PrismaService) {}
    
    async create(consultation: CreateConsultationParams): Promise<ConsultationEntity> {
        const newConsultation = await this.prisma.consultation.create({
            data: consultation,
        });
        return newConsultation;
    }

    async findById(id: string): Promise<ConsultationEntity | null> {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id },
        });
        return consultation;
    }

    async findAll(): Promise<ConsultationEntity[]> {
        const consultations = await this.prisma.consultation.findMany();
        return consultations;
    }

    async update(id: string, consultation: UpdateConsultationParams): Promise<ConsultationEntity> {
        const updatedConsultation = await this.prisma.consultation.update({
            where: { id },
            data: consultation,
        });
        return updatedConsultation;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.consultation.delete({ where: { id } });
    }
}