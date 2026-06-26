
import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';
import { AttributeValue, Attribute } from '@prisma/client';
import { AttributeMapper } from './attribute.mapper';

type AttributeValueWithAttribute = AttributeValue & {
    attribute: Attribute;
};

export class AttributeValueMapper {
    static toDomain(prismaAttributeValue: AttributeValueWithAttribute): AttributeValueEntity {
        return new AttributeValueEntity({
            id: prismaAttributeValue.id,
            attributeId: prismaAttributeValue.attributeId,
            attribute: AttributeMapper.toDomain(prismaAttributeValue.attribute),
            value: prismaAttributeValue.value,
            createdAt: prismaAttributeValue.createdAt,
            updatedAt: prismaAttributeValue.updatedAt,
        });
    }

    static toPrisma(attributeValue: AttributeValueEntity): Omit<AttributeValue, 'createdAt' | 'updatedAt'> {
        return {
            id: attributeValue.id,
            attributeId: attributeValue.attributeId,
            value: attributeValue.value,
        };
    }
}
