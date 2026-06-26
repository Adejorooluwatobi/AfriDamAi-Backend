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
exports.PrismaAttributeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const attribute_mapper_1 = require("../../mappers/attribute.mapper");
let PrismaAttributeRepository = class PrismaAttributeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const attribute = await this.prisma.attribute.create({
            data: params,
        });
        return attribute_mapper_1.AttributeMapper.toDomain(attribute);
    }
    async findById(id) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id },
        });
        return attribute ? attribute_mapper_1.AttributeMapper.toDomain(attribute) : null;
    }
    async findAll() {
        const attributes = await this.prisma.attribute.findMany();
        return attributes.map(attribute_mapper_1.AttributeMapper.toDomain);
    }
    async update(id, params) {
        const attribute = await this.prisma.attribute.update({
            where: { id },
            data: params,
        });
        return attribute_mapper_1.AttributeMapper.toDomain(attribute);
    }
    async delete(id) {
        await this.prisma.attribute.delete({
            where: { id },
        });
    }
};
exports.PrismaAttributeRepository = PrismaAttributeRepository;
exports.PrismaAttributeRepository = PrismaAttributeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAttributeRepository);
//# sourceMappingURL=prisma-attribute.repository.js.map