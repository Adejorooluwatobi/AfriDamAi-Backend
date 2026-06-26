import { CreateProductAttributeParams, UpdateProductAttributeParams } from 'src/utils/type';
import type { ProductAttributeRepositoryInterface } from '../repositories/product-attribute.repository.interface';
import { ProductAttributeEntity } from '../entities/product-attribute.entity';
export declare class ProductAttributeService {
    private readonly productAttributeRepository;
    private readonly logger;
    constructor(productAttributeRepository: ProductAttributeRepositoryInterface);
    createProduct(params: CreateProductAttributeParams): Promise<ProductAttributeEntity>;
    findById(id: string): Promise<ProductAttributeEntity | null>;
    findByProductId(id: string): Promise<ProductAttributeEntity[]>;
    delete(id: string): Promise<void>;
    updateProduct(id: string, params: UpdateProductAttributeParams): Promise<ProductAttributeEntity>;
}
