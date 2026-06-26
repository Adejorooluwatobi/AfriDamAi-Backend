import { AttributeEntity } from '../entities/attribute.entity';
import { CreateAttributeParams, UpdateAttributeParams } from 'src/utils/type';
import type { AttributeRepositoryInterface } from '../repositories/attribute.repository.interface';
export declare class AttributeService {
    private readonly attributeRepository;
    constructor(attributeRepository: AttributeRepositoryInterface);
    createAttribute(attributeDetails: CreateAttributeParams): Promise<AttributeEntity>;
    findAllAttributes(): Promise<AttributeEntity[]>;
    findOneAttribute(id: string): Promise<AttributeEntity>;
    updateAttribute(id: string, updateAttributeDetails: UpdateAttributeParams): Promise<AttributeEntity>;
    deleteAttribute(id: string): Promise<void>;
}
