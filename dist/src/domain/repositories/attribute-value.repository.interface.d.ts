import { AttributeValueEntity } from '../entities/atrribute-value.entity';
import { CreateAttributeValueParams, UpdateAttributeValueParams } from 'src/utils/type';
export interface AttributeValueRepositoryInterface {
    create(params: CreateAttributeValueParams): Promise<AttributeValueEntity>;
    findAll(): Promise<AttributeValueEntity[]>;
    findById(id: string): Promise<AttributeValueEntity | null>;
    findByAttributeId(attributeId: string): Promise<AttributeValueEntity[]>;
    update(id: string, params: UpdateAttributeValueParams): Promise<AttributeValueEntity>;
    delete(id: string): Promise<void>;
}
