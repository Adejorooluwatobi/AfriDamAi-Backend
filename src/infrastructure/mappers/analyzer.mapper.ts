import { AnalyzerEntity } from "src/domain/entities/analyzer.entity";
import { AI as Analyzer } from '@prisma/client'; // 🛡️ HONEST FIX: Alias AI to Analyzer
import { CreateAnalyzerParams } from "src/utils/type";

export class AnalyzerMapper {
  static toDomain(raw: Analyzer): AnalyzerEntity {
    return new AnalyzerEntity({
      id: raw.id,
      userId: raw.userId,
      imageUrl: raw.imageUrl,
      // Prisma stores Json as a JsonValue, we cast it to our Record type
      predictions: raw.predictions as Record<string, number>,
      label: (raw as any).label, // 🛡️ Added cast to handle potential schema mismatch
      aiImageUrl: (raw as any).aiImageUrl,
      description: raw.description,
      status: raw.status,
      createdAt: raw.createdAt,
    });
  }

  static toDomainArray(raws: Analyzer[]): AnalyzerEntity[] {
    return raws.map(analyzer => this.toDomain(analyzer));
  }

  static toPersistence(domain: Partial<AnalyzerEntity> | CreateAnalyzerParams): Record<string, any> {
    return {
      userId: domain.userId,
      imageUrl: domain.imageUrl,
      predictions: domain.predictions,
      label: (domain as any).label,
      aiImageUrl: (domain as any).aiImageUrl,
      description: domain.description,
      status: domain.status,
    };
  }
}