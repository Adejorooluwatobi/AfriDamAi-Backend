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
exports.PrismaAttributeValueRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const attribute_value_mapper_1 = require("../../mappers/attribute-value.mapper");
let PrismaAttributeValueRepository = class PrismaAttributeValueRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const attributeValue = await this.prisma.attributeValue.create({
            data: params,
            include: {
                attribute: true,
            },
        });
        return attribute_value_mapper_1.AttributeValueMapper.toDomain(attributeValue);
    }
    async findAll() {
        const attributeValues = await this.prisma.attributeValue.findMany({
            include: {
                attribute: true,
            },
        });
        return attributeValues.map(attribute_value_mapper_1.AttributeValueMapper.toDomain);
    }
    async findById(id) {
        const attributeValue = await this.prisma.attributeValue.findUnique({
            where: { id },
            include: {
                attribute: true,
            },
        });
        return attributeValue ? attribute_value_mapper_1.AttributeValueMapper.toDomain(attributeValue) : null;
    }
    async findByAttributeId(attributeId) {
        const attributeValues = await this.prisma.attributeValue.findMany({
            where: { attributeId },
            include: {
                attribute: true,
            },
        });
        return attributeValues.map(attribute_value_mapper_1.AttributeValueMapper.toDomain);
    }
    async update(id, params) {
        const attributeValue = await this.prisma.attributeValue.update({
            where: { id },
            data: params,
            include: {
                attribute: true,
            },
        });
        return attribute_value_mapper_1.AttributeValueMapper.toDomain(attributeValue);
    }
    async delete(id) {
        await this.prisma.attributeValue.delete({
            where: { id },
        });
    }
};
exports.PrismaAttributeValueRepository = PrismaAttributeValueRepository;
exports.PrismaAttributeValueRepository = PrismaAttributeValueRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAttributeValueRepository);
//# sourceMappingURL=prisma-attribute-value.repository.js.map