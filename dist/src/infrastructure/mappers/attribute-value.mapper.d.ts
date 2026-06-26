import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';
import { AttributeValue, Attribute } from '@prisma/client';
type AttributeValueWithAttribute = AttributeValue & {
    attribute: Attribute;
};
export declare class AttributeValueMapper {
    static toDomain(prismaAttributeValue: AttributeValueWithAttribute): AttributeValueEntity;
    static toPrisma(attributeValue: AttributeValueEntity): Omit<AttributeValue, 'createdAt' | 'updatedAt'>;
}
export {};
