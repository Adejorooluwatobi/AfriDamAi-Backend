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
exports.SpecialistRepository = void 0;
const common_1 = require("@nestjs/common");
const specialist_mapper_1 = require("../../mappers/specialist.mapper");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("./prisma.service");
let SpecialistRepository = class SpecialistRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const specialist = await this.prisma.specialist.findUnique({
            where: { id },
        });
        return specialist ? specialist_mapper_1.SpecialistMapper.toDomain(specialist) : null;
    }
    async findByEmail(email) {
        const specialist = await this.prisma.specialist.findUnique({
            where: { email },
        });
        return specialist ? specialist_mapper_1.SpecialistMapper.toDomain(specialist) : null;
    }
    async findByType(type) {
        const specialists = await this.prisma.specialist.findMany({
            where: { type },
            orderBy: { createdAt: 'desc' },
        });
        return specialist_mapper_1.SpecialistMapper.toDomainArray(specialists);
    }
    async findByStatus(status) {
        const specialists = await this.prisma.specialist.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });
        return specialist_mapper_1.SpecialistMapper.toDomainArray(specialists);
    }
    async findByOrganization(organizationId) {
        const specialists = await this.prisma.specialist.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
        });
        return specialist_mapper_1.SpecialistMapper.toDomainArray(specialists);
    }
    async findAll() {
        const specialists = await this.prisma.specialist.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return specialist_mapper_1.SpecialistMapper.toDomainArray(specialists);
    }
    async create(params) {
        const specialist = await this.prisma.specialist.create({
            data: {
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email,
                phoneNo: params.phoneNo,
                sex: params.sex,
                documents: params.documents,
                status: params.status ?? client_1.SpecialistStatus.PENDING,
                isActive: params.isActive ?? true,
                password: params.password,
                avatarUrl: params.avatarUrl,
                organizationId: params.organizationId,
            },
        });
        return specialist_mapper_1.SpecialistMapper.toDomain(specialist);
    }
    async update(id, params) {
        const { status, documentsUrl, ...rest } = params;
        const dataToUpdate = {
            ...rest,
        };
        if (status !== undefined) {
            dataToUpdate.status = status;
        }
        if (documentsUrl !== undefined) {
            dataToUpdate.documents = documentsUrl;
        }
        const specialist = await this.prisma.specialist.update({
            where: { id },
            data: dataToUpdate,
        });
        return specialist_mapper_1.SpecialistMapper.toDomain(specialist);
    }
    async delete(id) {
        await this.prisma.specialist.delete({
            where: { id },
        });
    }
};
exports.SpecialistRepository = SpecialistRepository;
exports.SpecialistRepository = SpecialistRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialistRepository);
//# sourceMappingURL=prisma-specialist.repository.js.map