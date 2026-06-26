import { AttributeRepositoryInterface } from 'src/domain/repositories/attribute.repository.interface';
import { AttributeEntity } from 'src/domain/entities/attribute.entity';
import { CreateAttributeParams, UpdateAttributeParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaAttributeRepository implements AttributeRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateAttributeParams): Promise<AttributeEntity>;
    findById(id: string): Promise<AttributeEntity | null>;
    findAll(): Promise<AttributeEntity[]>;
    update(id: string, params: UpdateAttributeParams): Promise<AttributeEntity>;
    delete(id: string): Promise<void>;
}
