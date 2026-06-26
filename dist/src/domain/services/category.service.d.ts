import type { CategoryRepositoryInterface } from '../repositories/category.repository.interface';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/type';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryResponseDto } from 'src/application/DTOs/categories/response-category.dto';
export declare class CategoryService {
    private readonly categoryRepository;
    private readonly logger;
    private readonly MAX_DEPTH;
    constructor(categoryRepository: CategoryRepositoryInterface);
    private generateUniqueSlug;
    private validateDepth;
    private ensureNoCycle;
    createCategory(params: CreateCategoryParams): Promise<CategoryEntity>;
    findAllCategories(): Promise<CategoryResponseDto[]>;
    findOneCategoryById(id: string): Promise<CategoryResponseDto>;
    updateCategory(id: string, update: UpdateCategoryParams): Promise<CategoryEntity>;
    deleteCategory(id: string): Promise<void>;
    getCategoryTree(): Promise<CategoryEntity[]>;
}
