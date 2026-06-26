import { Injectable } from '@nestjs/common';
import { AttributeRepositoryInterface } from 'src/domain/repositories/attribute.repository.interface';
import { AttributeEntity } from 'src/domain/entities/attribute.entity';
import { CreateAttributeParams, UpdateAttributeParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { AttributeMapper } from 'src/infrastructure/mappers/attribute.mapper';

@Injectable()
export class PrismaAttributeRepository implements AttributeRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateAttributeParams): Promise<AttributeEntity> {
        const attribute = await this.prisma.attribute.create({
            data: params,
        });
        return AttributeMapper.toDomain(attribute);
    }

    async findById(id: string): Promise<AttributeEntity | null> {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id },
        });
        return attribute ? AttributeMapper.toDomain(attribute) : null;
    }

    async findAll(): Promise<AttributeEntity[]> {
        const attributes = await this.prisma.attribute.findMany();
        return attributes.map(AttributeMapper.toDomain);
    }

    async update(id: string, params: UpdateAttributeParams): Promise<AttributeEntity> {
        const attribute = await this.prisma.attribute.update({
            where: { id },
            data: params,
        });
        return AttributeMapper.toDomain(attribute);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.attribute.delete({
            where: { id },
        });
    }
}