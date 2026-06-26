import { ProductEntity } from 'src/domain/entities/product.entity';
import { Product, Category, ProductCategory } from '@prisma/client';

type ProductWithRelations = Product & {
  primaryCategory?: { id: string; name: string } | null;
  productCategories?: (ProductCategory & { category: { id: string; name: string } })[];
};

export class ProductMapper {
  static toDomain(raw: ProductWithRelations): ProductEntity {
    return new ProductEntity({
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

      secondaryCategories:
        raw.productCategories?.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
        })) ?? [],
    });
  }

  static toPrisma(entity: ProductEntity) {
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
