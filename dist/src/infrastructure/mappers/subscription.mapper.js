"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMapper = void 0;
const subscription_entity_1 = require("../../domain/entities/subscription.entity");
class SubscriptionMapper {
    static toDomain(prismaSubscription) {
        return new subscription_entity_1.UserSubscriptionEntity({
            id: prismaSubscription.id,
            userId: prismaSubscription.userId,
            planId: prismaSubscription.planId,
            startDate: prismaSubscription.startDate,
            endDate: prismaSubscription.endDate ?? undefined,
            remainingSessions: prismaSubscription.remainingSessions,
            status: prismaSubscription.status,
            autoRenew: prismaSubscription.autoRenew,
            gatewaySubscriptionId: prismaSubscription.gatewaySubscriptionId ?? undefined,
            createdAt: prismaSubscription.createdAt,
            updatedAt: prismaSubscription.updatedAt,
        });
    }
}
exports.SubscriptionMapper = SubscriptionMapper;
//# sourceMappingURL=subscription.mapper.js.map