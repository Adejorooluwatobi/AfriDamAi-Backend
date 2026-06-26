import { CategoryEntity } from 'src/domain/entities/category.entity';
import { CreateCategoryDto } from 'src/application/DTOs/categories/create-category.dto';
import { CategoryService } from 'src/domain/services/category.service';
import { UpdateCategoryDto } from 'src/application/DTOs/categories/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(CreateCategoryDto: CreateCategoryDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CategoryEntity;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/categories/response-category.dto").CategoryResponseDto[];
    }>;
    findUser(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("../../application/DTOs/categories/response-category.dto").CategoryResponseDto;
    }>;
    update(id: string, UpdateCategoryDto: UpdateCategoryDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CategoryEntity;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    getTree(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CategoryEntity[];
    }>;
}
