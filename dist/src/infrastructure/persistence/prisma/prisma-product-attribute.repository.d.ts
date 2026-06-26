import { ProductAttributeRepositoryInterface } from 'src/domain/repositories/product-attribute.repository.interface';
import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { CreateProductAttributeParams, UpdateProductAttributeParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaProductAttributeRepository implements ProductAttributeRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateProductAttributeParams): Promise<ProductAttributeEntity>;
    findById(id: string): Promise<ProductAttributeEntity | null>;
    findByProductId(productId: string): Promise<ProductAttributeEntity[]>;
    update(id: string, params: UpdateProductAttributeParams): Promise<ProductAttributeEntity>;
    delete(id: string): Promise<void>;
}
