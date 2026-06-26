"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("../../domain/entities/user.entity");
const client_1 = require("@prisma/client");
const analyzer_mapper_1 = require("./analyzer.mapper");
const profile_mapper_1 = require("./profile.mapper");
const subscription_mapper_1 = require("./subscription.mapper");
const pricing_plan_mapper_1 = require("./pricing-plan.mapper");
class UserMapper {
    static toDomain(prismaUser) {
        let activeSubscription;
        let totalRemainingSessions = 0;
        const activeSubscriptions = [];
        if (prismaUser.subscriptions && prismaUser.subscriptions.length > 0) {
            const sortedSubs = [...prismaUser.subscriptions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            for (const sub of sortedSubs) {
                if (sub.status === client_1.SubscriptionStatus.ACTIVE && (sub.endDate ? sub.endDate > new Date() : true)) {
                    activeSubscriptions.push(sub);
                    totalRemainingSessions += sub.remainingSessions || 0;
                }
            }
            const now = new Date();
            const validPastSubs = sortedSubs.filter(s => {
                if (s.status !== client_1.SubscriptionStatus.PENDING)
                    return true;
                const ageInMinutes = (now.getTime() - s.createdAt.getTime()) / 60000;
                return ageInMinutes <= 15;
            });
            activeSubscription = activeSubscriptions.length > 0 ? activeSubscriptions[0] : validPastSubs[0];
        }
        return new user_entity_1.UserEntity({
            id: prismaUser.id,
            firstName: prismaUser.firstName,
            lastName: prismaUser.lastName,
            email: prismaUser.email,
            isActive: prismaUser.isActive,
            isSuspended: prismaUser.isSuspended,
            sex: prismaUser.sex,
            phoneNo: prismaUser.phoneNo,
            onboardingCompleted: prismaUser.onboardingCompleted,
            nationality: prismaUser.nationality ?? undefined,
            password: prismaUser.password ?? undefined,
            refreshToken: prismaUser.refreshToken ?? undefined,
            resetToken: prismaUser.resetToken ?? undefined,
            resetTokenExpiry: prismaUser.resetTokenExpiry ?? undefined,
            deletedAt: prismaUser.deletedAt ?? undefined,
            lastLoginAt: prismaUser.lastLoginAt ?? undefined,
            profile: prismaUser.profile
                ? profile_mapper_1.ProfileMapper.toDomain(prismaUser.profile)
                : undefined,
            subscription: activeSubscription
                ? subscription_mapper_1.SubscriptionMapper.toDomain(activeSubscription)
                : undefined,
            plan: prismaUser.currentPricingPlan
                ? pricing_plan_mapper_1.PricingPlanMapper.toDomain(prismaUser.currentPricingPlan)
                : undefined,
            analyzer: prismaUser.aiScans?.length
                ? analyzer_mapper_1.AnalyzerMapper.toDomain([...prismaUser.aiScans].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0])
                : undefined,
            analyzers: prismaUser.aiScans
                ? analyzer_mapper_1.AnalyzerMapper.toDomainArray(prismaUser.aiScans)
                : [],
            totalRemainingSessions: activeSubscriptions.length > 0 ? totalRemainingSessions : undefined,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        });
    }
    static toPersistence(user) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            sex: user.sex,
            currentPricingPlanId: user.plan?.id ?? null,
            phoneNo: user.phoneNo,
            onboardingCompleted: user.onboardingCompleted ?? false,
            nationality: user.nationality ?? null,
            password: user.password ?? null,
            isActive: user.isActive,
            isSuspended: user.isSuspended,
            refreshToken: user.refreshToken ?? null,
            resetToken: user.resetToken ?? null,
            resetTokenExpiry: user.resetTokenExpiry ?? null,
            deletedAt: user.deletedAt ?? null,
            lastLoginAt: user.lastLoginAt ?? null,
        };
    }
    static toSecureUserResponseDto(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            sex: user.sex,
            phoneNo: user.phoneNo,
            isActive: user.isActive,
            isSuspended: user.isSuspended,
            lastLoginAt: user.lastLoginAt ?? null,
            onboardingCompleted: user.onboardingCompleted ?? false,
            profile: user.profile ? user.profile : null,
            analyzers: user.analyzers ? user.analyzers : null,
            subscription: user.subscription ? {
                ...user.subscription,
                remainingSessions: user.totalRemainingSessions ?? user.subscription.remainingSessions
            } : null,
            plan: user.plan ? user.plan : {
                id: 'default-free',
                name: 'Free Tier',
                type: 'FREE',
                price: 0,
                description: ['Basic access'],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map