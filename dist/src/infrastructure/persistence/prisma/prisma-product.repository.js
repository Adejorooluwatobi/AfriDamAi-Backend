"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const product_mapper_1 = require("../../mappers/product.mapper");
let PrismaProductRepository = class PrismaProductRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.PRODUCT_INCLUDES = {
            primaryCategory: { select: { id: true, name: true } },
            productCategories: {
                include: {
                    category: { select: { id: true, name: true } },
                },
            },
        };
    }
    async create(params) {
        const data = {
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
            return product_mapper_1.ProductMapper.toDomain(created);
        }
        catch (error) {
            console.error('Prisma create error:', error);
            throw error;
        }
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: this.PRODUCT_INCLUDES,
        });
        return product ? product_mapper_1.ProductMapper.toDomain(product) : null;
    }
    async findAll() {
        const products = await this.prisma.product.findMany({
            include: this.PRODUCT_INCLUDES,
            orderBy: { createdAt: 'desc' },
        });
        return products.map(product_mapper_1.ProductMapper.toDomain);
    }
    async findByCategory(categoryId) {
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
        return products.map(product_mapper_1.ProductMapper.toDomain);
    }
    async findByVendor(vendorId) {
        const products = await this.prisma.product.findMany({
            where: {
                vendorId: vendorId,
                isActive: true,
            },
            include: this.PRODUCT_INCLUDES,
            orderBy: { createdAt: 'desc' },
        });
        return products.map(product_mapper_1.ProductMapper.toDomain);
    }
    async searchProducts(term) {
        const products = await this.prisma.product.findMany({
            where: {
                name: { contains: term, mode: 'insensitive' },
            },
            include: this.PRODUCT_INCLUDES,
            orderBy: { createdAt: 'desc' },
        });
        return products.map(product_mapper_1.ProductMapper.toDomain);
    }
    async findBySlug(slug) {
        const raw = await this.prisma.product.findUnique({
            where: { slug },
            include: this.PRODUCT_INCLUDES,
        });
        return raw ? product_mapper_1.ProductMapper.toDomain(raw) : null;
    }
    async delete(id) {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async update(id, params) {
        const data = {};
        if (params.name !== undefined)
            data.name = params.name;
        if (params.slug !== undefined)
            data.slug = params.slug;
        if (params.description !== undefined)
            data.description = params.description;
        if (params.basePrice !== undefined)
            data.basePrice = params.basePrice;
        if (params.isActive !== undefined)
            data.isActive = params.isActive;
        if (params.stock !== undefined)
            data.stock = params.stock;
        if (params.imageUrl !== undefined)
            data.imageUrl = params.imageUrl;
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
        return product_mapper_1.ProductMapper.toDomain(updated);
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductRepository);
//# sourceMappingURL=prisma-product.repository.js.map