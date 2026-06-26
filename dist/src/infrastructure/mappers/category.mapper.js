"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMapper = void 0;
const category_entity_1 = require("../../domain/entities/category.entity");
class CategoryMapper {
    static toDomain(raw) {
        if (!raw)
            throw new Error('Cannot map empty category');
        return new category_entity_1.CategoryEntity({
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            description: raw.description ?? null,
            parentId: raw.parentId ?? null,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toPrisma(category) {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description ?? null,
            parentId: category.parentId ?? null,
            isActive: category.isActive,
        };
    }
}
exports.CategoryMapper = CategoryMapper;
//# sourceMappingURL=category.mapper.js.map