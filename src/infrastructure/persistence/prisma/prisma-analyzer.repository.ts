import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";
import { IAnalyzerRepository } from "src/domain/repositories/analyzer.repository.interface";
import { AnalyzerMapper } from "../../mappers/analyzer.mapper";
import { CreateAnalyzerParams, UpdateAnalyzerParams } from "src/utils/type";
import { AI as Analyzer, Prisma } from "@prisma/client"; // 🛡️ HONEST FIX: Alias AI to Analyzer


@Injectable()
export class PrismaAnalyzerRepository implements IAnalyzerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<AnalyzerEntity | null> {
        // 🛡️ SYNCED: Changed .analyzer to .aI
        const analyzer = await this.prisma.aI.findUnique({ 
            where: { id },
            include: { user: true }
        });
        return analyzer ? AnalyzerMapper.toDomain(analyzer as Analyzer) : null;
    }

    async findAll(): Promise<AnalyzerEntity[]> {
        // 🛡️ SYNCED: Changed .analyzer to .aI
        const analyzers = await this.prisma.aI.findMany({ 
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        return AnalyzerMapper.toDomainArray(analyzers as Analyzer[]);
    }

    async findByUserId(userId: string, userType: string = 'user'): Promise<AnalyzerEntity | null> {
        const validUserTypes = ['user'];
        if (!validUserTypes.includes(userType)) {
            throw new NotFoundException('Invalid user type');
        }
        
        const whereClause: any = {};
        if (userType === 'user') whereClause.userId = userId;
        
        // 🛡️ SYNCED: Changed .analyzer to .aI
        const analyzer = await this.prisma.aI.findFirst({ 
            where: whereClause,
            include: { user: true }
        });
        return analyzer ? AnalyzerMapper.toDomain(analyzer as Analyzer) : null;
    }

    async create(analyzerData: CreateAnalyzerParams): Promise<AnalyzerEntity> {
        // 🛡️ SYNCED: Changed .analyzer to .aI and cast to appropriate Input type
        const analyzer = await this.prisma.aI.create({ 
            data: AnalyzerMapper.toPersistence(analyzerData) as any,
            include: { user: true }
        });
        return AnalyzerMapper.toDomain(analyzer as Analyzer);
    }

    async update(id: string, analyzerData: Partial<UpdateAnalyzerParams>): Promise<AnalyzerEntity> {
        if (!id || typeof id !== 'string') {
            throw new NotFoundException('Invalid analyzer ID');
        }
        // 🛡️ SYNCED: Changed .analyzer to .aI
        const analyzer = await this.prisma.aI.update({ 
            where: { id }, 
            data: AnalyzerMapper.toPersistence(analyzerData) as any,
            include: { user: true }
        });
        return AnalyzerMapper.toDomain(analyzer as Analyzer);
    }

    async delete(id: string): Promise<void> {
        if (!id || typeof id !== 'string') {
            throw new NotFoundException('Invalid analyzer ID');
        }
        // 🛡️ SYNCED: Changed .analyzer to .aI
        await this.prisma.aI.delete({ where: { id } });
    }

    async findAllByUserId(userId: string): Promise<AnalyzerEntity[]> {
        // 🛡️ SYNCED: Changed .analyzer to .aI
        const analyzers = await this.prisma.aI.findMany({ 
              where: { userId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        return AnalyzerMapper.toDomainArray(analyzers as Analyzer[]);
    }
}