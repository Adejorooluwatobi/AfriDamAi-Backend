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
exports.PricingPlanService = void 0;
const common_1 = require("@nestjs/common");
const pricing_plan_entity_1 = require("../entities/pricing-plan.entity");
let PricingPlanService = class PricingPlanService {
    constructor(pricingPlanRepository) {
        this.pricingPlanRepository = pricingPlanRepository;
    }
    async findAll() {
        return this.pricingPlanRepository.findAll();
    }
    async findActive() {
        return this.pricingPlanRepository.findActive();
    }
    async getActivePlans() {
        return this.findActive();
    }
    async findByType(type) {
        return this.pricingPlanRepository.findByType(type);
    }
    async findOne(id) {
        return this.pricingPlanRepository.findById(id);
    }
    async create(params) {
        const plan = new pricing_plan_entity_1.PricingPlan({
            id: '',
            name: params.name,
            type: params.type,
            price: params.price,
            durationDays: params.durationDays,
            appointmentLimit: params.appointmentLimit,
            isInstantSession: params.isInstantSession,
            description: params.description,
            isActive: params.isActive ?? true
        });
        return this.pricingPlanRepository.create(plan);
    }
    async update(id, params) {
        return this.pricingPlanRepository.update(id, params);
    }
    async delete(id) {
        return this.pricingPlanRepository.delete(id);
    }
    async seedDefaultPricingPlans() {
        const defaultPlans = [
            {
                id: '001',
                name: 'Starter Care Plan',
                type: 'STARTER_PLAN',
                price: 3000,
                description: ['Comprehensive care plan for the first month'],
                isActive: true
            },
            {
                id: '002',
                name: 'Instant Specialist Session',
                type: 'INSTANT_SESSION',
                price: 15000,
                description: ['One-time consultation with a specialist'],
                isActive: true
            },
            {
                id: '003',
                name: 'Premium Monthly',
                type: 'PREMIUM_PLAN',
                price: 30000,
                description: ['Unlimited specialist access for 30 days'],
                isActive: true
            }
        ];
        const results = [];
        for (const planData of defaultPlans) {
            const created = await this.create(planData);
            results.push(created);
        }
        return results;
    }
};
exports.PricingPlanService = PricingPlanService;
exports.PricingPlanService = PricingPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IPricingPlanRepository')),
    __metadata("design:paramtypes", [Object])
], PricingPlanService);
//# sourceMappingURL=pricing-plan.service.js.map