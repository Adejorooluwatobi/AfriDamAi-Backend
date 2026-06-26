export declare class AnalyzerEntity {
    id: string;
    userId: string;
    imageUrl: string;
    predictions: Record<string, number>;
    description: string;
    status: string;
    label?: string;
    aiImageUrl?: string;
    createdAt: Date;
    constructor(partial: Partial<AnalyzerEntity>);
}
