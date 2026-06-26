"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPlanMapper = void 0;
const pricing_plan_entity_1 = require("../../domain/entities/pricing-plan.entity");
class PricingPlanMapper {
    static toDomain(prismaPricingPlan) {
        return new pricing_plan_entity_1.PricingPlan({
            id: prismaPricingPlan.id,
            name: prismaPricingPlan.name,
            type: prismaPricingPlan.type,
            price: prismaPricingPlan.price,
            durationDays: prismaPricingPlan.duration ?? undefined,
            appointmentLimit: prismaPricingPlan.appointmentLimit ?? undefined,
            isInstantSession: prismaPricingPlan.isInstantSession,
            description: prismaPricingPlan.description,
            isActive: prismaPricingPlan.isActive,
            isDeleted: prismaPricingPlan.isDeleted,
            deletedAt: prismaPricingPlan.deletedAt ?? undefined,
            createdAt: prismaPricingPlan.createdAt,
            paystackPlanCode: prismaPricingPlan.paystackPlanCode ?? undefined,
            updatedAt: prismaPricingPlan.updatedAt,
        });
    }
    static toDomainArray(prismaPricingPlans) {
        return prismaPricingPlans.map(plan => this.toDomain(plan));
    }
    static toPersistence(pricingPlan) {
        return {
            id: pricingPlan.id,
            name: pricingPlan.name,
            type: pricingPlan.type,
            price: pricingPlan.price,
            duration: pricingPlan.durationDays ?? null,
            appointmentLimit: pricingPlan.appointmentLimit ?? null,
            isInstantSession: pricingPlan.isInstantSession ?? false,
            description: pricingPlan.description,
            isActive: pricingPlan.isActive,
            isDeleted: pricingPlan.isDeleted,
            deletedAt: pricingPlan.deletedAt ?? null,
            paystackPlanCode: pricingPlan.paystackPlanCode ?? null,
        };
    }
}
exports.PricingPlanMapper = PricingPlanMapper;
//# sourceMappingURL=pricing-plan.mapper.js.map