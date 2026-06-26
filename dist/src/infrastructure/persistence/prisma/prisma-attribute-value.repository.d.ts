import { AttributeValueRepositoryInterface } from 'src/domain/repositories/attribute-value.repository.interface';
import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';
import { CreateAttributeValueParams, UpdateAttributeValueParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaAttributeValueRepository implements AttributeValueRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateAttributeValueParams): Promise<AttributeValueEntity>;
    findAll(): Promise<AttributeValueEntity[]>;
    findById(id: string): Promise<AttributeValueEntity | null>;
    findByAttributeId(attributeId: string): Promise<AttributeValueEntity[]>;
    update(id: string, params: UpdateAttributeValueParams): Promise<AttributeValueEntity>;
    delete(id: string): Promise<void>;
}
