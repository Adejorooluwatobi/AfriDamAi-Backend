import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaCategoryRepository implements CategoryRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateCategoryParams): Promise<CategoryEntity>;
    findById(id: string): Promise<CategoryEntity | null>;
    findByNameInParent(name: string, parentId: string | null): Promise<CategoryEntity | null>;
    findBySlugInParent(slug: string, parentId: string | null): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
    findAllRaw(): Promise<any[]>;
    update(id: string, params: UpdateCategoryParams): Promise<CategoryEntity>;
    delete(id: string): Promise<void>;
}
