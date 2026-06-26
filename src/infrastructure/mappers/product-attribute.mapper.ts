import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { ProductAttribute } from '@prisma/client';

export class ProductAttributeMapper {
    static toDomain(prismaProductAttribute: ProductAttribute): ProductAttributeEntity {
        return new ProductAttributeEntity({
            id: prismaProductAttribute.id,
            productId: prismaProductAttribute.productId,
            attributeId: prismaProductAttribute.attributeId,
            attributeValueId: prismaProductAttribute.attributeValueId,
        });
    }

    static toPrisma(productAttribute: ProductAttributeEntity): ProductAttribute {
        return {
            id: productAttribute.id,
            productId: productAttribute.productId,
            attributeId: productAttribute.attributeId,
            attributeValueId: productAttribute.attributeValueId,
        };
    }
}