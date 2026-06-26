import { Injectable } from '@nestjs/common';
import { AttributeValueRepositoryInterface } from 'src/domain/repositories/attribute-value.repository.interface';
import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';
import { CreateAttributeValueParams, UpdateAttributeValueParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { AttributeValueMapper } from 'src/infrastructure/mappers/attribute-value.mapper';

@Injectable()
export class PrismaAttributeValueRepository implements AttributeValueRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateAttributeValueParams): Promise<AttributeValueEntity> {
        const attributeValue = await this.prisma.attributeValue.create({
            data: params,
            include: {
                attribute: true,
            },
        });
        return AttributeValueMapper.toDomain(attributeValue);
    }

    async findAll(): Promise<AttributeValueEntity[]> {
        const attributeValues = await this.prisma.attributeValue.findMany({
            include: {
                attribute: true,
            },
        });
        return attributeValues.map(AttributeValueMapper.toDomain);
    }

    async findById(id: string): Promise<AttributeValueEntity | null> {
        const attributeValue = await this.prisma.attributeValue.findUnique({
            where: { id },
            include: {
                attribute: true,
            },
        });
        return attributeValue ? AttributeValueMapper.toDomain(attributeValue) : null;
    }

    async findByAttributeId(attributeId: string): Promise<AttributeValueEntity[]> {
        const attributeValues = await this.prisma.attributeValue.findMany({
            where: { attributeId },
            include: {
                attribute: true,
            },
        });
        return attributeValues.map(AttributeValueMapper.toDomain);
    }

    async update(id: string, params: UpdateAttributeValueParams): Promise<AttributeValueEntity> {
        const attributeValue = await this.prisma.attributeValue.update({
            where: { id },
            data: params,
            include: {
                attribute: true,
            },
        });
        return AttributeValueMapper.toDomain(attributeValue);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.attributeValue.delete({
            where: { id },
        });
    }
}