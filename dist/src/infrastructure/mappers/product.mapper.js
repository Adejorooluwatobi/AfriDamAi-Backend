"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const product_entity_1 = require("../../domain/entities/product.entity");
class ProductMapper {
    static toDomain(raw) {
        return new product_entity_1.ProductEntity({
            id: raw.id,
            name: raw.name,
            slug: raw.slug,
            description: raw.description,
            basePrice: raw.basePrice,
            imageUrl: raw.imageUrl ?? undefined,
            isActive: raw.isActive,
            stock: raw.stock,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            vendorId: raw.vendorId ?? undefined,
            primaryCategory: raw.primaryCategory
                ? {
                    id: raw.primaryCategory.id,
                    name: raw.primaryCategory.name,
                }
                : null,
            secondaryCategories: raw.productCategories?.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
            })) ?? [],
        });
    }
    static toPrisma(entity) {
        return {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            description: entity.description ?? null,
            basePrice: entity.basePrice,
            imageUrl: entity.imageUrl ?? null,
            isActive: entity.isActive,
            stock: entity.stock,
            vendor: entity.vendorId ? { connect: { id: entity.vendorId } } : undefined,
            primaryCategory: entity.primaryCategory
                ? { connect: { id: entity.primaryCategory.id } }
                : undefined,
            productCategories: entity.secondaryCategories?.length
                ? {
                    create: entity.secondaryCategories.map((cat) => ({
                        category: { connect: { id: cat.id } },
                    })),
                }
                : undefined,
        };
    }
}
exports.ProductMapper = ProductMapper;
//# sourceMappingURL=product.mapper.js.map