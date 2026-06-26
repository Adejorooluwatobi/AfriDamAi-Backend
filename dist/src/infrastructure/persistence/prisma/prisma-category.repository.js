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
exports.PrismaCategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const category_mapper_1 = require("../../mappers/category.mapper");
let PrismaCategoryRepository = class PrismaCategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const category = await this.prisma.category.create({
            data: {
                ...params,
                parentId: params.parentId ?? undefined,
            },
        });
        return category_mapper_1.CategoryMapper.toDomain(category);
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        return category ? category_mapper_1.CategoryMapper.toDomain(category) : null;
    }
    async findByNameInParent(name, parentId) {
        const raw = await this.prisma.category.findFirst({
            where: { name, parentId: parentId ?? null },
        });
        return raw ? category_mapper_1.CategoryMapper.toDomain(raw) : null;
    }
    async findBySlugInParent(slug, parentId) {
        const raw = await this.prisma.category.findFirst({
            where: { slug, parentId: parentId ?? null },
        });
        return raw ? category_mapper_1.CategoryMapper.toDomain(raw) : null;
    }
    async findAll() {
        const raws = await this.prisma.category.findMany();
        return raws.map(category_mapper_1.CategoryMapper.toDomain);
    }
    async findAllRaw() {
        return this.prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
    }
    async update(id, params) {
        const category = await this.prisma.category.update({
            where: { id },
            data: params,
        });
        console.log('Prisma returned:', category);
        return category_mapper_1.CategoryMapper.toDomain(category);
    }
    async delete(id) {
        await this.prisma.category.delete({
            where: { id },
        });
    }
};
exports.PrismaCategoryRepository = PrismaCategoryRepository;
exports.PrismaCategoryRepository = PrismaCategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCategoryRepository);
//# sourceMappingURL=prisma-category.repository.js.map