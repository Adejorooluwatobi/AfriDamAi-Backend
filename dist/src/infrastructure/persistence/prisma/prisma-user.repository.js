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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const user_mapper_1 = require("../../mappers/user.mapper");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
        });
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
        });
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true },
            orderBy: { createdAt: 'desc' },
        });
        return users.map(user_mapper_1.UserMapper.toDomain);
    }
    async create(userData) {
        const user = await this.prisma.user.create({
            data: userData,
            include: { profile: true }
        });
        return user_mapper_1.UserMapper.toDomain(user);
    }
    async update(id, userData) {
        const { profile, ...userFields } = userData;
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...userFields,
                profile: profile ? {
                    upsert: {
                        create: {
                            ...((() => {
                                const { userId, previousTreatments, ...rest } = profile;
                                const newProfileData = { ...rest };
                                if (previousTreatments !== undefined) {
                                    newProfileData.previousTreatment = previousTreatments;
                                }
                                return newProfileData;
                            })()),
                            ageRange: profile.ageRange ?? 0,
                            skinType: profile.skinType ?? '',
                            onboardingCompleted: profile.onboardingCompleted ?? false,
                        },
                        update: {
                            ...((() => {
                                const { userId, previousTreatments, ...rest } = profile;
                                const newProfileData = { ...rest };
                                if (previousTreatments !== undefined) {
                                    newProfileData.previousTreatment = previousTreatments;
                                }
                                return newProfileData;
                            })()),
                        }
                    }
                } : undefined
            },
            include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
        });
        return user_mapper_1.UserMapper.toDomain(user);
    }
    async findByResetToken(resetToken) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: resetToken,
                resetTokenExpiry: {
                    gt: new Date()
                }
            },
            include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
        });
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map