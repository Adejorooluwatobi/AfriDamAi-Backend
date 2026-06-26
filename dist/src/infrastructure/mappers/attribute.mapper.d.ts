import { AttributeEntity } from 'src/domain/entities/attribute.entity';
import { Attribute } from '@prisma/client';
export declare class AttributeMapper {
    static toDomain(prismaAttribute: Attribute): AttributeEntity;
    static toPrisma(attribute: AttributeEntity): Omit<Attribute, 'createdAt' | 'updatedAt'>;
}
