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
exports.PrismaProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const profile_mapper_1 = require("../../mappers/profile.mapper");
let PrismaProfileRepository = class PrismaProfileRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
            include: { user: true }
        });
        return profile ? profile_mapper_1.ProfileMapper.toDomain(profile) : null;
    }
    async findByEmail(email) {
        const profile = await this.prisma.profile.findFirst({
            where: {
                user: { email }
            },
            include: { user: true }
        });
        return profile ? profile_mapper_1.ProfileMapper.toDomain(profile) : null;
    }
    async findAll() {
        const profiles = await this.prisma.profile.findMany({
            include: { user: true }
        });
        return profile_mapper_1.ProfileMapper.toDomainArray(profiles);
    }
    async findByUserId(userId, userType = 'user') {
        if (userType !== 'user') {
            throw new common_1.NotFoundException('Profile only exists for clinical users');
        }
        const profile = await this.prisma.profile.findFirst({
            where: { userId },
            include: { user: true }
        });
        return profile ? profile_mapper_1.ProfileMapper.toDomain(profile) : null;
    }
    async create(profileData) {
        const { userId, previousTreatments, ...rest } = profileData;
        const prismaData = {
            ...rest,
            userId,
            previousTreatment: previousTreatments || []
        };
        delete prismaData.skinHistory;
        delete prismaData.knownSkinCondition;
        delete prismaData.knownBodyLotion;
        delete prismaData.knownBodyLotionBrand;
        const profile = await this.prisma.profile.create({
            data: prismaData,
            include: { user: true }
        });
        return profile_mapper_1.ProfileMapper.toDomain(profile);
    }
    async update(id, profileData) {
        if (!id) {
            throw new common_1.NotFoundException('Invalid profile ID');
        }
        const { previousTreatments, ...rest } = profileData;
        const prismaData = { ...rest };
        if (previousTreatments !== undefined) {
            prismaData.previousTreatment = previousTreatments;
        }
        delete prismaData.skinHistory;
        delete prismaData.knownSkinCondition;
        delete prismaData.knownBodyLotion;
        delete prismaData.knownBodyLotionBrand;
        const profile = await this.prisma.profile.update({
            where: { id },
            data: prismaData,
            include: { user: true }
        });
        return profile_mapper_1.ProfileMapper.toDomain(profile);
    }
    async delete(id) {
        if (!id) {
            throw new common_1.NotFoundException('Invalid profile ID');
        }
        await this.prisma.profile.delete({ where: { id } });
    }
};
exports.PrismaProfileRepository = PrismaProfileRepository;
exports.PrismaProfileRepository = PrismaProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProfileRepository);
//# sourceMappingURL=prisma-profile.repository.js.map