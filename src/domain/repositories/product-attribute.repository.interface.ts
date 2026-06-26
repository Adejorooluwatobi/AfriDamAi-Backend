import { ProductAttributeEntity } from '../entities/product-attribute.entity';
import { CreateProductAttributeParams, UpdateProductAttributeParams } from 'src/utils/type';

export interface ProductAttributeRepositoryInterface {
    create(params: CreateProductAttributeParams): Promise<ProductAttributeEntity>;
    findById(id: string): Promise<ProductAttributeEntity | null>;
    findByProductId(productId: string): Promise<ProductAttributeEntity[]>;
    update(id: string, params: UpdateProductAttributeParams): Promise<ProductAttributeEntity>;
    delete(id: string): Promise<void>;
}