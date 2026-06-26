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
exports.PrismaSubscriptionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const subscription_mapper_1 = require("../../mappers/subscription.mapper");
let PrismaSubscriptionRepository = class PrismaSubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const subscription = await this.prisma.userSubscription.create({
            data: params,
        });
        return subscription_mapper_1.SubscriptionMapper.toDomain(subscription);
    }
    async findById(id) {
        const subscription = await this.prisma.userSubscription.findUnique({
            where: { id },
        });
        return subscription ? subscription_mapper_1.SubscriptionMapper.toDomain(subscription) : null;
    }
    async findByIdWithPlan(id) {
        const subscriptionWithPlan = await this.prisma.userSubscription.findUnique({
            where: { id },
            include: {
                pricingPlan: true,
            },
        });
        return subscriptionWithPlan;
    }
    async findByUserId(userId) {
        const subscriptions = await this.prisma.userSubscription.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return subscriptions.map(subscription_mapper_1.SubscriptionMapper.toDomain);
    }
    async findByUserIdWithPlan(userId) {
        const subscriptionsWithPlan = await this.prisma.userSubscription.findMany({
            where: { userId },
            include: {
                pricingPlan: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return subscriptionsWithPlan;
    }
    async findActiveByUserId(userId) {
        const subscription = await this.prisma.userSubscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
                endDate: { gt: new Date() }
            },
            orderBy: { endDate: 'desc' }
        });
        return subscription ? subscription_mapper_1.SubscriptionMapper.toDomain(subscription) : null;
    }
    async update(id, params) {
        const subscription = await this.prisma.userSubscription.update({
            where: { id },
            data: {
                startDate: params.startDate,
                endDate: params.endDate,
                status: params.status,
                autoRenew: params.autoRenew,
                remainingSessions: params.remainingSessions,
                gatewaySubscriptionId: params.gatewaySubscriptionId,
            },
        });
        return subscription_mapper_1.SubscriptionMapper.toDomain(subscription);
    }
    async findByGatewaySubscriptionId(gatewaySubscriptionId) {
        const subscription = await this.prisma.userSubscription.findUnique({
            where: { gatewaySubscriptionId },
        });
        return subscription ? subscription_mapper_1.SubscriptionMapper.toDomain(subscription) : null;
    }
    async delete(id) {
        await this.prisma.userSubscription.delete({
            where: { id },
        });
    }
    async findUsersByStatus(status) {
        const now = new Date();
        if (status === 'ACTIVE') {
            return this.prisma.user.findMany({
                where: {
                    subscriptions: {
                        some: {
                            status: 'ACTIVE',
                            endDate: { gt: now }
                        }
                    }
                },
                include: {
                    subscriptions: {
                        where: {
                            status: 'ACTIVE',
                            endDate: { gt: now }
                        },
                        include: {
                            pricingPlan: true
                        }
                    },
                    currentPricingPlan: true,
                    profile: true
                }
            });
        }
        else if (status === 'EXPIRED') {
            return this.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            subscriptions: {
                                none: {
                                    status: 'ACTIVE',
                                    endDate: { gt: now }
                                }
                            }
                        },
                        {
                            subscriptions: {
                                some: {
                                    OR: [
                                        { status: 'EXPIRED' },
                                        {
                                            status: 'ACTIVE',
                                            endDate: { lte: now }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                include: {
                    subscriptions: {
                        orderBy: { endDate: 'desc' },
                        take: 1,
                        include: {
                            pricingPlan: true
                        }
                    },
                    currentPricingPlan: true,
                    profile: true
                }
            });
        }
        return [];
    }
};
exports.PrismaSubscriptionRepository = PrismaSubscriptionRepository;
exports.PrismaSubscriptionRepository = PrismaSubscriptionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSubscriptionRepository);
//# sourceMappingURL=prisma-subscription.repository.js.map