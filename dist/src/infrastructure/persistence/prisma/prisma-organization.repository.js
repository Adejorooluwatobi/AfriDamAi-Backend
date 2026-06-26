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
exports.PrismaOrganizationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const organization_mapper_1 = require("../../mappers/organization.mapper");
let PrismaOrganizationRepository = class PrismaOrganizationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const org = await this.prisma.organization.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                logoUrl: data.logoUrl,
                brandingColors: data.brandingColors ? JSON.parse(JSON.stringify(data.brandingColors)) : undefined,
                licenseUrl: data.licenseUrl,
                licenseNumber: data.licenseNumber,
                status: data.status,
                isActive: data.isActive ?? true,
            },
        });
        return organization_mapper_1.OrganizationMapper.toDomain(org);
    }
    async findById(id) {
        const org = await this.prisma.organization.findUnique({ where: { id } });
        return org ? organization_mapper_1.OrganizationMapper.toDomain(org) : null;
    }
    async findByEmail(email) {
        const org = await this.prisma.organization.findUnique({ where: { email } });
        return org ? organization_mapper_1.OrganizationMapper.toDomain(org) : null;
    }
    async findAll() {
        const orgs = await this.prisma.organization.findMany();
        return organization_mapper_1.OrganizationMapper.toDomainArray(orgs);
    }
    async update(id, data) {
        const org = await this.prisma.organization.update({
            where: { id },
            data: {
                ...data,
            },
        });
        return organization_mapper_1.OrganizationMapper.toDomain(org);
    }
    async delete(id) {
        await this.prisma.organization.delete({ where: { id } });
    }
    async findActive() {
        const orgs = await this.prisma.organization.findMany({ where: { isActive: true } });
        return organization_mapper_1.OrganizationMapper.toDomainArray(orgs);
    }
};
exports.PrismaOrganizationRepository = PrismaOrganizationRepository;
exports.PrismaOrganizationRepository = PrismaOrganizationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaOrganizationRepository);
//# sourceMappingURL=prisma-organization.repository.js.map