import { Injectable } from '@nestjs/common';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { CategoryMapper } from 'src/infrastructure/mappers/category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async create(params: CreateCategoryParams): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({
     data: {
      ...params,
      parentId: params.parentId ?? undefined,
    } as any,
    });
    return CategoryMapper.toDomain(category);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findByNameInParent(
    name: string,
    parentId: string | null,
  ): Promise<CategoryEntity | null> {
    const raw = await this.prisma.category.findFirst({
      where: { name, parentId: parentId ?? null },
    });
    return raw ? CategoryMapper.toDomain(raw) : null;
  }

  async findBySlugInParent(
    slug: string,
    parentId: string | null,
  ): Promise<CategoryEntity | null> {
    const raw = await this.prisma.category.findFirst({
      where: { slug, parentId: parentId ?? null },
    });
    return raw ? CategoryMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const raws = await this.prisma.category.findMany();
    return raws.map(CategoryMapper.toDomain);
  }

  async findAllRaw(): Promise<any[]> {
    return this.prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async update(
    id: string,
    params: UpdateCategoryParams,
  ): Promise<CategoryEntity> {
    const category = await this.prisma.category.update({
      where: { id },
      data: params,
    });
    console.log('Prisma returned:', category);
    return CategoryMapper.toDomain(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
