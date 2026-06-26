import { CategoryEntity } from 'src/domain/entities/category.entity';
import { Category } from '@prisma/client';
export declare class CategoryMapper {
    static toDomain(raw: Category): CategoryEntity;
    static toPrisma(category: CategoryEntity): Omit<Category, 'createdAt' | 'updatedAt'>;
}
