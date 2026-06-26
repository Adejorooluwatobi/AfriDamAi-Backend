import { AttributeValueService } from '../../domain/services/attribute-value.service';
import { CreateAttributeValueDto } from '../../application/DTOs/attributes/create-attribute-value.dto';
import { UpdateAttributeValueDto } from '../../application/DTOs/attributes/update-attribute-value.dto';
import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';
export declare class AttributeValueController {
    private readonly attributeValueService;
    constructor(attributeValueService: AttributeValueService);
    create(dto: CreateAttributeValueDto): Promise<AttributeValueEntity>;
    findAll(): Promise<AttributeValueEntity[]>;
    findByAttributeId(attributeId: string): Promise<AttributeValueEntity[]>;
    findOne(id: string): Promise<AttributeValueEntity>;
    update(id: string, dto: UpdateAttributeValueDto): Promise<AttributeValueEntity>;
    remove(id: string): Promise<void>;
}
