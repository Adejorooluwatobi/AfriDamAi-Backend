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
exports.PrismaPricingPlanRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const pricing_plan_mapper_1 = require("../../mappers/pricing-plan.mapper");
let PrismaPricingPlanRepository = class PrismaPricingPlanRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(plan) {
        const { id, durationDays, appointmentLimit, ...restOfPlan } = plan;
        const dataForPrisma = {
            ...restOfPlan,
            duration: durationDays ?? null,
            appointmentLimit: appointmentLimit ?? null,
            isInstantSession: restOfPlan.isInstantSession ?? false,
            paystackPlanCode: restOfPlan.paystackPlanCode ?? null,
        };
        const created = await this.prisma.pricingPlan.create({
            data: dataForPrisma,
        });
        return pricing_plan_mapper_1.PricingPlanMapper.toDomain(created);
    }
    async findAll() {
        const plans = await this.prisma.pricingPlan.findMany({
            where: { isDeleted: false }
        });
        return pricing_plan_mapper_1.PricingPlanMapper.toDomainArray(plans);
    }
    async findByType(type) {
        const plans = await this.prisma.pricingPlan.findMany({
            where: { type, isActive: true, isDeleted: false },
        });
        return pricing_plan_mapper_1.PricingPlanMapper.toDomainArray(plans);
    }
    async findActive() {
        const plans = await this.prisma.pricingPlan.findMany({
            where: { isActive: true, isDeleted: false }
        });
        return pricing_plan_mapper_1.PricingPlanMapper.toDomainArray(plans);
    }
    async findById(id) {
        const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
        return plan ? pricing_plan_mapper_1.PricingPlanMapper.toDomain(plan) : null;
    }
    async update(id, params) {
        const { durationDays, ...rest } = params;
        const updated = await this.prisma.pricingPlan.update({
            where: { id },
            data: {
                ...rest,
                duration: durationDays !== undefined ? durationDays : undefined,
                type: params.type ? params.type : undefined,
                paystackPlanCode: params.paystackPlanCode || null,
            },
        });
        return pricing_plan_mapper_1.PricingPlanMapper.toDomain(updated);
    }
    async delete(id) {
        const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
        if (!plan)
            return;
        const deletedName = `${plan.id}_DELETED_${plan.name}`;
        await this.prisma.pricingPlan.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
                name: deletedName
            }
        });
    }
};
exports.PrismaPricingPlanRepository = PrismaPricingPlanRepository;
exports.PrismaPricingPlanRepository = PrismaPricingPlanRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPricingPlanRepository);
//# sourceMappingURL=prisma-pricing-plan.repository.js.map