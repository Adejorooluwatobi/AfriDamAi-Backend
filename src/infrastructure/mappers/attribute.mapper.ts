import { AttributeEntity } from 'src/domain/entities/attribute.entity';
import { Attribute   } from '@prisma/client';

export class AttributeMapper {
    static toDomain(prismaAttribute: Attribute): AttributeEntity {
        return new AttributeEntity({
            id: prismaAttribute.id,
            name: prismaAttribute.name,
            type: prismaAttribute.type,
            isRequired: prismaAttribute.isRequired,
            createdAt: prismaAttribute.createdAt,
            updatedAt: prismaAttribute.updatedAt,
        });
    }

    static toPrisma(attribute: AttributeEntity): Omit<Attribute, 'createdAt' | 'updatedAt'> {
        return {
            id: attribute.id,
            name: attribute.name,
            type: attribute.type,
            isRequired: attribute.isRequired,
        };
    }
}