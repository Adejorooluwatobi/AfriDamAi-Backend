"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeMapper = void 0;
const attribute_entity_1 = require("../../domain/entities/attribute.entity");
class AttributeMapper {
    static toDomain(prismaAttribute) {
        return new attribute_entity_1.AttributeEntity({
            id: prismaAttribute.id,
            name: prismaAttribute.name,
            type: prismaAttribute.type,
            isRequired: prismaAttribute.isRequired,
            createdAt: prismaAttribute.createdAt,
            updatedAt: prismaAttribute.updatedAt,
        });
    }
    static toPrisma(attribute) {
        return {
            id: attribute.id,
            name: attribute.name,
            type: attribute.type,
            isRequired: attribute.isRequired,
        };
    }
}
exports.AttributeMapper = AttributeMapper;
//# sourceMappingURL=attribute.mapper.js.map