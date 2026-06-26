import { ProductEntity } from '../entities/product.entity';
import { CreateProductParams, UpdateProductParams } from 'src/utils/type';
export interface ProductRepositoryInterface {
    create(params: CreateProductParams): Promise<ProductEntity>;
    findById(id: string): Promise<ProductEntity | null>;
    findAll(): Promise<ProductEntity[]>;
    findByCategory(categoryId: string): Promise<ProductEntity[]>;
    findByVendor(vendorId: string): Promise<ProductEntity[]>;
    update(id: string, params: UpdateProductParams): Promise<ProductEntity>;
    delete(id: string): Promise<void>;
    searchProducts(term: string): Promise<ProductEntity[]>;
    findBySlug(slug: string): Promise<ProductEntity | null>;
}
