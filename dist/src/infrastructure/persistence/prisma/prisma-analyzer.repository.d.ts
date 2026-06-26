import { PrismaService } from "./prisma.service";
import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";
import { IAnalyzerRepository } from "src/domain/repositories/analyzer.repository.interface";
import { CreateAnalyzerParams, UpdateAnalyzerParams } from "src/utils/type";
export declare class PrismaAnalyzerRepository implements IAnalyzerRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<AnalyzerEntity | null>;
    findAll(): Promise<AnalyzerEntity[]>;
    findByUserId(userId: string, userType?: string): Promise<AnalyzerEntity | null>;
    create(analyzerData: CreateAnalyzerParams): Promise<AnalyzerEntity>;
    update(id: string, analyzerData: Partial<UpdateAnalyzerParams>): Promise<AnalyzerEntity>;
    delete(id: string): Promise<void>;
    findAllByUserId(userId: string): Promise<AnalyzerEntity[]>;
}
