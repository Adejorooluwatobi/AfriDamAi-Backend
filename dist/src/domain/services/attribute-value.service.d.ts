import { AttributeValueEntity } from '../entities/atrribute-value.entity';
import { CreateAttributeValueParams, UpdateAttributeValueParams } from 'src/utils/type';
import type { AttributeValueRepositoryInterface } from '../repositories/attribute-value.repository.interface';
import type { AttributeRepositoryInterface } from '../repositories/attribute.repository.interface';
export declare class AttributeValueService {
    private readonly attributeValueRepository;
    private readonly attributeRepository;
    constructor(attributeValueRepository: AttributeValueRepositoryInterface, attributeRepository: AttributeRepositoryInterface);
    createAttributeValue(valueDetails: CreateAttributeValueParams): Promise<AttributeValueEntity>;
    findAllAttributeValues(): Promise<AttributeValueEntity[]>;
    findOneAttributeValue(id: string): Promise<AttributeValueEntity>;
    findByAttributeId(attributeId: string): Promise<AttributeValueEntity[]>;
    updateAttributeValue(id: string, updateDetails: UpdateAttributeValueParams): Promise<AttributeValueEntity>;
    deleteAttributeValue(id: string): Promise<void>;
}
