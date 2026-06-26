import { AnalyzerService } from 'src/domain/services/analyzer.service';
import { CreateAnalyzerDto } from 'src/application/DTOs/analyzer/create-analyzer.dto';
import { UpdateAnalyzerDto } from 'src/application/DTOs/analyzer/update-analyzer.dto';
export declare class AnalyzerController {
    private readonly analyzerService;
    constructor(analyzerService: AnalyzerService);
    scan(file: any, moreInfo: string, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../domain/entities/analyzer.entity").AnalyzerEntity;
    }>;
    analyzeSkintone(file: any, req: any, moreInfo: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../domain/entities/analyzer.entity").AnalyzerEntity;
    }>;
    create(createAnalyzerDto: CreateAnalyzerDto, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../domain/entities/analyzer.entity").AnalyzerEntity;
    }>;
    checkHealth(): Promise<any>;
    getMyAnalyzer(req: any): Promise<import("../../domain/entities/analyzer.entity").AnalyzerEntity>;
    getAllAnalyzers(): Promise<import("../../domain/entities/analyzer.entity").AnalyzerEntity[]>;
    getAnalyzer(id: string): Promise<import("../../domain/entities/analyzer.entity").AnalyzerEntity>;
    getAnalyzersbyUserId(id: string): Promise<import("../../domain/entities/analyzer.entity").AnalyzerEntity[]>;
    updateAnalyzer(id: string, updateAnalyzerDto: Partial<UpdateAnalyzerDto>): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../domain/entities/analyzer.entity").AnalyzerEntity;
    }>;
    deleteAnalyzer(id: string): Promise<void>;
    private extractUserId;
}
