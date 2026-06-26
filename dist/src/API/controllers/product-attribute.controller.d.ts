import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { CreateProductAttributeDto } from 'src/application/DTOs/attributes/create-product-attribute.dto';
import { UpdateProductAttributeDto } from 'src/application/DTOs/attributes/update-product-attribute.dto';
import { ProductAttributeService } from 'src/domain/services/product-attribute.service';
export declare class ProductAttributeController {
    private readonly productAttrService;
    constructor(productAttrService: ProductAttributeService);
    Create(CreateProductAttributeDto: CreateProductAttributeDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductAttributeEntity;
    }>;
    findById(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductAttributeEntity;
    }>;
    findByProductId(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductAttributeEntity[];
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    update(id: string, UpdateProductAttributeDto: UpdateProductAttributeDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ProductAttributeEntity;
    }>;
}
