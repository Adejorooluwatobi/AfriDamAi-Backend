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
exports.PrismaProductAttributeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const product_attribute_mapper_1 = require("../../mappers/product-attribute.mapper");
let PrismaProductAttributeRepository = class PrismaProductAttributeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const productAttribute = await this.prisma.productAttribute.create({
            data: params,
        });
        return product_attribute_mapper_1.ProductAttributeMapper.toDomain(productAttribute);
    }
    async findById(id) {
        const productAttribute = await this.prisma.productAttribute.findUnique({
            where: { id },
        });
        return productAttribute ? product_attribute_mapper_1.ProductAttributeMapper.toDomain(productAttribute) : null;
    }
    async findByProductId(productId) {
        const productAttributes = await this.prisma.productAttribute.findMany({
            where: { productId },
        });
        return productAttributes.map(product_attribute_mapper_1.ProductAttributeMapper.toDomain);
    }
    async update(id, params) {
        const productAttribute = await this.prisma.productAttribute.update({
            where: { id },
            data: params,
        });
        return product_attribute_mapper_1.ProductAttributeMapper.toDomain(productAttribute);
    }
    async delete(id) {
        await this.prisma.productAttribute.delete({
            where: { id },
        });
    }
};
exports.PrismaProductAttributeRepository = PrismaProductAttributeRepository;
exports.PrismaProductAttributeRepository = PrismaProductAttributeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductAttributeRepository);
//# sourceMappingURL=prisma-product-attribute.repository.js.map