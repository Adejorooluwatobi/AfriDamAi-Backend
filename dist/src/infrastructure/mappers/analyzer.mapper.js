"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerMapper = void 0;
const analyzer_entity_1 = require("../../domain/entities/analyzer.entity");
class AnalyzerMapper {
    static toDomain(raw) {
        return new analyzer_entity_1.AnalyzerEntity({
            id: raw.id,
            userId: raw.userId,
            imageUrl: raw.imageUrl,
            predictions: raw.predictions,
            label: raw.label,
            aiImageUrl: raw.aiImageUrl,
            description: raw.description,
            status: raw.status,
            createdAt: raw.createdAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map(analyzer => this.toDomain(analyzer));
    }
    static toPersistence(domain) {
        return {
            userId: domain.userId,
            imageUrl: domain.imageUrl,
            predictions: domain.predictions,
            label: domain.label,
            aiImageUrl: domain.aiImageUrl,
            description: domain.description,
            status: domain.status,
        };
    }
}
exports.AnalyzerMapper = AnalyzerMapper;
//# sourceMappingURL=analyzer.mapper.js.map