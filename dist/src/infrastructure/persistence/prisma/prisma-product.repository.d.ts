import { ProductRepositoryInterface } from 'src/domain/repositories/product.repository.interface';
import { ProductEntity } from 'src/domain/entities/product.entity';
import { CreateProductParams, UpdateProductParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaProductRepository implements ProductRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    PRODUCT_INCLUDES: {
        primaryCategory: {
            select: {
                id: boolean;
                name: boolean;
            };
        };
        productCategories: {
            include: {
                category: {
                    select: {
                        id: boolean;
                        name: boolean;
                    };
                };
            };
        };
    };
    create(params: CreateProductParams): Promise<ProductEntity>;
    findById(id: string): Promise<ProductEntity | null>;
    findAll(): Promise<ProductEntity[]>;
    findByCategory(categoryId: string): Promise<ProductEntity[]>;
    findByVendor(vendorId: string): Promise<ProductEntity[]>;
    searchProducts(term: string): Promise<ProductEntity[]>;
    findBySlug(slug: string): Promise<ProductEntity | null>;
    delete(id: string): Promise<void>;
    update(id: string, params: UpdateProductParams): Promise<ProductEntity>;
}
