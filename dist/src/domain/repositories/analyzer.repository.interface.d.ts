import { CreateAnalyzerParams, UpdateAnalyzerParams } from "src/utils/type";
import { AnalyzerEntity } from "../entities/analyzer.entity";
export interface IAnalyzerRepository {
    findById(id: string): Promise<AnalyzerEntity | null>;
    findAll(): Promise<AnalyzerEntity[]>;
    findByUserId(userId: string, userType: string): Promise<AnalyzerEntity | null>;
    findAllByUserId(userId: string): Promise<AnalyzerEntity[]>;
    create(user: CreateAnalyzerParams): Promise<AnalyzerEntity>;
    update(id: string, user: Partial<UpdateAnalyzerParams>): Promise<AnalyzerEntity>;
    delete(id: string): Promise<void>;
}
