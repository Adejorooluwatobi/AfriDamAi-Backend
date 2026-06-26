import { CategoryEntity } from 'src/domain/entities/category.entity';
import { Category } from '@prisma/client';

export class CategoryMapper {
  static toDomain(
    raw: Category,
  ): CategoryEntity {
    if (!raw) throw new Error('Cannot map empty category');
    return new CategoryEntity({
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

  static toPrisma(
    category: CategoryEntity,
  ): Omit<Category, 'createdAt' | 'updatedAt'> {
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
