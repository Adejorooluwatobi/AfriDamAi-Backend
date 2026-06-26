import { Injectable } from '@nestjs/common';
import { ProductAttributeRepositoryInterface } from 'src/domain/repositories/product-attribute.repository.interface';
import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { CreateProductAttributeParams, UpdateProductAttributeParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { ProductAttributeMapper } from 'src/infrastructure/mappers/product-attribute.mapper';

@Injectable()
export class PrismaProductAttributeRepository implements ProductAttributeRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateProductAttributeParams): Promise<ProductAttributeEntity> {
        const productAttribute = await this.prisma.productAttribute.create({
            data: params,
        });
        return ProductAttributeMapper.toDomain(productAttribute);
    }

    async findById(id: string): Promise<ProductAttributeEntity | null> {
        const productAttribute = await this.prisma.productAttribute.findUnique({
            where: { id },
        });
        return productAttribute ? ProductAttributeMapper.toDomain(productAttribute) : null;
    }

    async findByProductId(productId: string): Promise<ProductAttributeEntity[]> {
        const productAttributes = await this.prisma.productAttribute.findMany({
            where: { productId },
        });
        return productAttributes.map(ProductAttributeMapper.toDomain);
    }

    async update(id: string, params: UpdateProductAttributeParams): Promise<ProductAttributeEntity> {
        const productAttribute = await this.prisma.productAttribute.update({
            where: { id },
            data: params,
        });
        return ProductAttributeMapper.toDomain(productAttribute);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.productAttribute.delete({
            where: { id },
        });
    }
}