import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { ProductAttribute } from '@prisma/client';
export declare class ProductAttributeMapper {
    static toDomain(prismaProductAttribute: ProductAttribute): ProductAttributeEntity;
    static toPrisma(productAttribute: ProductAttributeEntity): ProductAttribute;
}
