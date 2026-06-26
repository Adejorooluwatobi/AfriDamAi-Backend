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
exports.SubscriptionValidationService = void 0;
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("./subscription.service");
const subscription_entity_1 = require("../entities/subscription.entity");
const date_fns_1 = require("date-fns");
let SubscriptionValidationService = class SubscriptionValidationService {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async validateSubscriptionForAppointment(userId) {
        const allSubscriptions = await this.subscriptionService.getUserSubscriptionsWithPlan(userId);
        const activeSubscriptions = allSubscriptions.filter(sub => sub.status === subscription_entity_1.SubscriptionStatus.ACTIVE && (sub.endDate ? new Date(sub.endDate) > new Date() : true));
        if (activeSubscriptions.length === 0) {
            return {
                eligible: false,
                reason: 'No active subscription found. Please subscribe to a plan first.',
            };
        }
        let totalRemainingSessions = 0;
        let hasInstantSession = false;
        let latestActiveSubscription = null;
        let maxEndDate = null;
        for (const sub of activeSubscriptions) {
            const plan = sub.pricingPlan;
            if (plan.isInstantSession) {
                hasInstantSession = true;
            }
            else if (plan.appointmentLimit !== null) {
                totalRemainingSessions += sub.remainingSessions || 0;
            }
            if (!maxEndDate || (sub.endDate && new Date(sub.endDate) > maxEndDate)) {
                maxEndDate = sub.endDate ? new Date(sub.endDate) : null;
                latestActiveSubscription = sub;
            }
        }
        if (hasInstantSession) {
            return {
                eligible: true,
                subscription: latestActiveSubscription,
                daysRemaining: this.calculateDaysRemaining(maxEndDate),
            };
        }
        if (totalRemainingSessions <= 0) {
            return {
                eligible: false,
                reason: 'You have no remaining appointment slots across your active subscriptions.',
            };
        }
        return {
            eligible: true,
            subscription: latestActiveSubscription,
            daysRemaining: this.calculateDaysRemaining(maxEndDate),
        };
    }
    calculateDaysRemaining(endDate) {
        if (!endDate)
            return 0;
        const now = new Date();
        return (0, date_fns_1.differenceInDays)(new Date(endDate), now);
    }
};
exports.SubscriptionValidationService = SubscriptionValidationService;
exports.SubscriptionValidationService = SubscriptionValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionValidationService);
//# sourceMappingURL=subscription-validation.service.js.map