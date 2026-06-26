import { AttributeService } from '../../domain/services/attribute.service';
import { CreateAttributeDto } from '../../application/DTOs/attributes/create-attribute.dto';
import { UpdateAttributeDto } from '../../application/DTOs/attributes/update-attribute.dto';
import { AttributeEntity } from 'src/domain/entities/attribute.entity';
export declare class AttributeController {
    private readonly attributeService;
    constructor(attributeService: AttributeService);
    create(dto: CreateAttributeDto): Promise<AttributeEntity>;
    findAll(): Promise<AttributeEntity[]>;
    findOne(id: string): Promise<AttributeEntity>;
    update(id: string, dto: UpdateAttributeDto): Promise<AttributeEntity>;
    remove(id: string): Promise<void>;
}
