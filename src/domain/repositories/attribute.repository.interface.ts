import { AttributeEntity } from '../entities/attribute.entity';
import { CreateAttributeParams, UpdateAttributeParams } from 'src/utils/type';

export interface AttributeRepositoryInterface {
    create(params: CreateAttributeParams): Promise<AttributeEntity>;
    findById(id: string): Promise<AttributeEntity | null>;
    findAll(): Promise<AttributeEntity[]>;
    update(id: string, params: UpdateAttributeParams): Promise<AttributeEntity>;
    delete(id: string): Promise<void>;
}