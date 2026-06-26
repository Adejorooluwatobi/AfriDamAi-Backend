import { CreateProductDto } from 'src/application/DTOs/products/create-product.dto';
import { UpdateProductDto } from 'src/application/DTOs/products/update-product.dto';
import { ProductService } from 'src/domain/services/product.service';
import { ProductEntity } from 'src/domain/entities/product.entity';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    Create(request: any, CreateProductDto: CreateProductDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity[];
    }>;
    findOneProductById(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity;
    }>;
    findProductsByVendor(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity[];
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    update(id: string, UpdateProductDto: UpdateProductDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity;
    }>;
    findOneProductBySlug(slug: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity;
    }>;
    findOneProductByCategory(categoryId: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity[];
    }>;
    searchProducts(term: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductEntity[];
    }>;
}
