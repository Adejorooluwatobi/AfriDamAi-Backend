import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/type';
export interface CategoryRepositoryInterface {
    create(params: CreateCategoryParams): Promise<CategoryEntity>;
    findById(Id: string): Promise<CategoryEntity | null>;
    findByNameInParent(name: string, parentId: string | null): Promise<CategoryEntity | null>;
    findBySlugInParent(slug: string, parentId: string | null): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
    findAllRaw(): Promise<any[]>;
    update(id: string, params: UpdateCategoryParams): Promise<CategoryEntity>;
    delete(id: string): Promise<void>;
}
