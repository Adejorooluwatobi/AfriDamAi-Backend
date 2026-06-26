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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const pricing_plan_service_1 = require("./pricing-plan.service");
const date_fns_1 = require("date-fns");
const subscription_entity_1 = require("../entities/subscription.entity");
const subscription_mapper_1 = require("../../infrastructure/mappers/subscription.mapper");
const pricing_plan_mapper_1 = require("../../infrastructure/mappers/pricing-plan.mapper");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const user_mapper_1 = require("../../infrastructure/mappers/user.mapper");
const admin_notification_service_1 = require("./admin-notification.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionRepository, pricingPlanService, prisma, adminNotificationService, mailService, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.pricingPlanService = pricingPlanService;
        this.prisma = prisma;
        this.adminNotificationService = adminNotificationService;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }
    async createSubscription(params) {
        const plan = await this.pricingPlanService.findOne(params.planId);
        if (!plan)
            throw new common_1.NotFoundException('Pricing Plan not found');
        const now = new Date();
        let endDate;
        let remainingSessions;
        const autoRenew = params.autoRenew !== undefined ? params.autoRenew : !plan.isInstantSession;
        if (plan.isInstantSession) {
            remainingSessions = 0;
            endDate = (0, date_fns_1.addDays)(now, 1);
        }
        else {
            if (plan.durationDays) {
                endDate = (0, date_fns_1.addDays)(now, plan.durationDays);
            }
            if (plan.appointmentLimit) {
                remainingSessions = plan.appointmentLimit;
            }
        }
        const subscriptionToCreate = {
            ...params,
            startDate: params.startDate || now,
            endDate: endDate,
            remainingSessions: remainingSessions,
            status: subscription_entity_1.SubscriptionStatus.PENDING,
            autoRenew: autoRenew,
        };
        return this.subscriptionRepository.create(subscriptionToCreate);
    }
    async findActiveSubscription(userId) {
        return this.subscriptionRepository.findActiveByUserId(userId);
    }
    async findByGatewaySubscriptionId(gatewaySubscriptionId) {
        return this.subscriptionRepository.findByGatewaySubscriptionId(gatewaySubscriptionId);
    }
    async getUserSubscriptions(userId) {
        return this.subscriptionRepository.findByUserId(userId);
    }
    async getUserSubscriptionsWithPlan(userId) {
        const subscriptionsWithPlan = await this.subscriptionRepository.findByUserIdWithPlan(userId);
        return subscriptionsWithPlan.map(sub => {
            const userSubscription = subscription_mapper_1.SubscriptionMapper.toDomain(sub);
            const pricingPlan = pricing_plan_mapper_1.PricingPlanMapper.toDomain(sub.pricingPlan);
            userSubscription.pricingPlan = pricingPlan;
            return userSubscription;
        });
    }
    async getSubscriptionById(id) {
        const subscriptionWithPlan = await this.subscriptionRepository.findByIdWithPlan(id);
        if (!subscriptionWithPlan)
            throw new common_1.NotFoundException('Subscription not found');
        const userSubscription = subscription_mapper_1.SubscriptionMapper.toDomain(subscriptionWithPlan);
        const pricingPlan = pricing_plan_mapper_1.PricingPlanMapper.toDomain(subscriptionWithPlan.pricingPlan);
        userSubscription.pricingPlan = pricingPlan;
        return userSubscription;
    }
    async extendSubscription(id, months) {
        const sub = await this.getSubscriptionById(id);
        const newEndDate = new Date(sub.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + months);
        return this.subscriptionRepository.update(id, { endDate: newEndDate });
    }
    async cancelSubscription(id) {
        return this.toggleAutoRenew(id, false);
    }
    async toggleAutoRenew(id, autoRenew) {
        const sub = await this.getSubscriptionById(id);
        if (!sub)
            throw new common_1.NotFoundException('Subscription not found');
        const updated = await this.subscriptionRepository.update(id, { autoRenew });
        try {
            const user = await this.userRepository.findById(sub.userId);
            if (user) {
                await this.mailService.sendAutoRenewalStatusEmail(user.email, sub.pricingPlan?.name || 'Subscription Plan', autoRenew);
            }
        }
        catch (e) {
            console.error(`Failed to notify user on auto-renewal change for sub: ${id}`, e);
        }
        return updated;
    }
    async update(id, params) {
        return this.subscriptionRepository.update(id, params);
    }
    async activateSubscription(id, startDate, endDate) {
        const sub = await this.getSubscriptionById(id);
        if (!sub)
            throw new common_1.NotFoundException('Subscription not found');
        const plan = sub.pricingPlan;
        const remainingSessions = plan.appointmentLimit !== undefined && plan.appointmentLimit !== null ? plan.appointmentLimit : undefined;
        const updatedSubscription = await this.subscriptionRepository.update(id, {
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            startDate: startDate,
            endDate: endDate,
            remainingSessions: remainingSessions,
        });
        await this.prisma.user.update({
            where: { id: sub.userId },
            data: { currentPricingPlanId: sub.planId },
        });
        return updatedSubscription;
    }
    async decrementRemainingSessions(subscriptionId) {
        const sub = await this.getSubscriptionById(subscriptionId);
        if (sub.remainingSessions !== null && sub.remainingSessions > 0) {
            const updatedSessions = sub.remainingSessions - 1;
            const updateParams = { remainingSessions: updatedSessions };
            if (updatedSessions === 0) {
                updateParams['status'] = subscription_entity_1.SubscriptionStatus.EXPIRED;
            }
            return this.subscriptionRepository.update(subscriptionId, updateParams);
        }
        if (sub.remainingSessions === 0) {
            throw new common_1.BadRequestException('No remaining sessions available.');
        }
        return sub;
    }
    async endInstantSession(subscriptionId) {
        const sub = await this.getSubscriptionById(subscriptionId);
        return this.subscriptionRepository.update(subscriptionId, {
            status: subscription_entity_1.SubscriptionStatus.EXPIRED,
            remainingSessions: 0,
        });
    }
    async updateRemainingSessions(subscriptionId, sessions) {
        const sub = await this.getSubscriptionById(subscriptionId);
        if (!sub)
            throw new common_1.NotFoundException('Subscription not found');
        return this.subscriptionRepository.update(subscriptionId, {
            remainingSessions: sessions,
            status: sessions > 0 ? subscription_entity_1.SubscriptionStatus.ACTIVE : sub.status,
        });
    }
    async grantSessionsToUser(userId, sessions) {
        const subscriptions = await this.getUserSubscriptions(userId);
        if (subscriptions.length > 0) {
            const latestSub = subscriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            return this.updateRemainingSessions(latestSub.id, sessions);
        }
        const plans = await this.pricingPlanService.findAll();
        const defaultPlan = plans.find(p => p.type === 'STANDARD' || p.name.includes('Starter')) || plans[0];
        if (!defaultPlan) {
            throw new common_1.BadRequestException('No suitable pricing plan found to grant sessions.');
        }
        const now = new Date();
        const endDate = (0, date_fns_1.addDays)(now, 30);
        const sub = await this.subscriptionRepository.create({
            userId,
            planId: defaultPlan.id,
            startDate: now,
            endDate: endDate,
            remainingSessions: sessions,
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            autoRenew: false,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { currentPricingPlanId: defaultPlan.id },
        });
        await this.adminNotificationService.notify('SUBSCRIPTION', 'Manual Sessions Granted', `<p>Manual sessions have been granted to a user.</p>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Sessions:</strong> ${sessions}</p>`, false);
        return sub;
    }
    async adminGrantSubscription(params) {
        const { userId, planId } = params;
        const plan = await this.pricingPlanService.findOne(planId);
        if (!plan)
            throw new common_1.NotFoundException('Pricing Plan not found');
        const now = new Date();
        let endDate;
        let remainingSessions;
        if (plan.isInstantSession) {
            remainingSessions = 0;
            endDate = (0, date_fns_1.addDays)(now, 1);
        }
        else {
            if (plan.durationDays) {
                endDate = (0, date_fns_1.addDays)(now, plan.durationDays);
            }
            if (plan.appointmentLimit) {
                remainingSessions = plan.appointmentLimit;
            }
        }
        const sub = await this.subscriptionRepository.create({
            userId,
            planId,
            startDate: now,
            endDate: endDate,
            remainingSessions: remainingSessions,
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            autoRenew: !plan.isInstantSession,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { currentPricingPlanId: planId },
        });
        await this.adminNotificationService.notify('SUBSCRIPTION', 'New Subscription Granted', `<p>A new subscription plan has been manually granted to a user by an admin.</p>
       <p><strong>User ID:</strong> ${userId}</p>
       <p><strong>Plan ID:</strong> ${planId}</p>
       <p><strong>Plan Name:</strong> ${plan.name}</p>`, false);
        return sub;
    }
    async getUsersWithSubscriptionStatus(status) {
        const users = await this.subscriptionRepository.findUsersByStatus(status);
        return users.map(user => {
            const userEntity = user_mapper_1.UserMapper.toDomain(user);
            return user_mapper_1.UserMapper.toSecureUserResponseDto(userEntity);
        });
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ISubscriptionRepository')),
    __param(5, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, pricing_plan_service_1.PricingPlanService,
        prisma_service_1.PrismaService,
        admin_notification_service_1.AdminNotificationService,
        mail_service_1.MailService, Object])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map