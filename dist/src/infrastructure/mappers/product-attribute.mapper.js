"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAttributeMapper = void 0;
const product_attribute_entity_1 = require("../../domain/entities/product-attribute.entity");
class ProductAttributeMapper {
    static toDomain(prismaProductAttribute) {
        return new product_attribute_entity_1.ProductAttributeEntity({
            id: prismaProductAttribute.id,
            productId: prismaProductAttribute.productId,
            attributeId: prismaProductAttribute.attributeId,
            attributeValueId: prismaProductAttribute.attributeValueId,
        });
    }
    static toPrisma(productAttribute) {
        return {
            id: productAttribute.id,
            productId: productAttribute.productId,
            attributeId: productAttribute.attributeId,
            attributeValueId: productAttribute.attributeValueId,
        };
    }
}
exports.ProductAttributeMapper = ProductAttributeMapper;
//# sourceMappingURL=product-attribute.mapper.js.map