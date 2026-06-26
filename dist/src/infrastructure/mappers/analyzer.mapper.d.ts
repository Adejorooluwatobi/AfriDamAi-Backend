import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";
import { AI as Analyzer } from '@prisma/client';
import { CreateAnalyzerParams } from "src/utils/type";
export declare class AnalyzerMapper {
    static toDomain(raw: Analyzer): AnalyzerEntity;
    static toDomainArray(raws: Analyzer[]): AnalyzerEntity[];
    static toPersistence(domain: Partial<AnalyzerEntity> | CreateAnalyzerParams): Record<string, any>;
}
