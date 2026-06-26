"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValueMapper = void 0;
const atrribute_value_entity_1 = require("../../domain/entities/atrribute-value.entity");
const attribute_mapper_1 = require("./attribute.mapper");
class AttributeValueMapper {
    static toDomain(prismaAttributeValue) {
        return new atrribute_value_entity_1.AttributeValueEntity({
            id: prismaAttributeValue.id,
            attributeId: prismaAttributeValue.attributeId,
            attribute: attribute_mapper_1.AttributeMapper.toDomain(prismaAttributeValue.attribute),
            value: prismaAttributeValue.value,
            createdAt: prismaAttributeValue.createdAt,
            updatedAt: prismaAttributeValue.updatedAt,
        });
    }
    static toPrisma(attributeValue) {
        return {
            id: attributeValue.id,
            attributeId: attributeValue.attributeId,
            value: attributeValue.value,
        };
    }
}
exports.AttributeValueMapper = AttributeValueMapper;
//# sourceMappingURL=attribute-value.mapper.js.map