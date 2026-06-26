import { Injectable } from '@nestjs/common';
import { ProductRepositoryInterface } from 'src/domain/repositories/product.repository.interface';
import { ProductEntity } from 'src/domain/entities/product.entity';
import { CreateProductParams, UpdateProductParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { ProductMapper } from 'src/infrastructure/mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  PRODUCT_INCLUDES = {
    primaryCategory: { select: { id: true, name: true } },
    productCategories: {
      include: {
        category: { select: { id: true, name: true } },
      },
    },
  };

  async create(params: CreateProductParams): Promise<ProductEntity> {
    const data: any = {
      name: params.name,
      slug: params.slug,
      description: params.description ?? null,
      imageUrl: params.imageUrl ?? null,
      basePrice: params.basePrice,
      isActive: params.isActive ?? true,
      stock: params.stock ?? 0,
      vendor: params.vendorId
        ? { connect: { id: params.vendorId } }
        : undefined,
    };

    if (params.primaryCategoryId) {
      data.primaryCategory = { connect: { id: params.primaryCategoryId } };
    }

    if (params.secondaryCategoryIds?.length) {
      data.productCategories = {
        create: params.secondaryCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    try {
      const created = await this.prisma.product.create({
        data,
        include: this.PRODUCT_INCLUDES,
      });
      return ProductMapper.toDomain(created);
    } catch (error) {
      console.error('Prisma create error:', error);
      throw error; // or throw new InternalServerErrorException(error.message)
    }
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.PRODUCT_INCLUDES,
    });

    return product ? ProductMapper.toDomain(product) : null;
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      include: this.PRODUCT_INCLUDES,
      orderBy: { createdAt: 'desc' },
    });

    return products.map(ProductMapper.toDomain);
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { primaryCategoryId: categoryId },
          { productCategories: { some: { categoryId } } },
        ],
        isActive: true,
      },
      include: this.PRODUCT_INCLUDES,
      orderBy: { createdAt: 'desc' },
    });

    return products.map(ProductMapper.toDomain);
  }

  async findByVendor(vendorId: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        vendorId: vendorId,
        isActive: true,
      },
      include: this.PRODUCT_INCLUDES,
      orderBy: { createdAt: 'desc' },
    });
    
    return products.map(ProductMapper.toDomain);
  }

  async searchProducts(term: string): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        name: { contains: term, mode: 'insensitive' },
      },
      include: this.PRODUCT_INCLUDES,
      orderBy: { createdAt: 'desc' },
    });

    return products.map(ProductMapper.toDomain);
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const raw = await this.prisma.product.findUnique({
      where: { slug },
      include: this.PRODUCT_INCLUDES,
    });

    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async update(
    id: string,
    params: UpdateProductParams,
  ): Promise<ProductEntity> {
    const data: any = {};

    if (params.name !== undefined) data.name = params.name;
    if (params.slug !== undefined) data.slug = params.slug;
    if (params.description !== undefined) data.description = params.description;
    if (params.basePrice !== undefined) data.basePrice = params.basePrice;
    if (params.isActive !== undefined) data.isActive = params.isActive;
    if (params.stock !== undefined) data.stock = params.stock;
    if (params.imageUrl !== undefined) data.imageUrl = params.imageUrl;

    if (params.primaryCategoryId !== undefined) {
      data.primaryCategory = params.primaryCategoryId
        ? { connect: { id: params.primaryCategoryId } }
        : { disconnect: true };
    }

    if (params.secondaryCategoryIds !== undefined) {
      data.productCategories = {
        deleteMany: {},
        create: params.secondaryCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: this.PRODUCT_INCLUDES,
    });

    return ProductMapper.toDomain(updated);
  }
}
