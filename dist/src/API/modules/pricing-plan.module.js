"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPlanModule = void 0;
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_pricing_plan_repository_1 = require("../../infrastructure/persistence/prisma/prisma-pricing-plan.repository");
const pricing_plan_controller_1 = require("../controllers/pricing-plan.controller");
const pricing_plan_service_1 = require("../../domain/services/pricing-plan.service");
const common_1 = require("@nestjs/common");
let PricingPlanModule = class PricingPlanModule {
};
exports.PricingPlanModule = PricingPlanModule;
exports.PricingPlanModule = PricingPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [pricing_plan_controller_1.PricingPlanController],
        providers: [
            pricing_plan_service_1.PricingPlanService,
            {
                provide: 'IPricingPlanRepository',
                useClass: prisma_pricing_plan_repository_1.PrismaPricingPlanRepository,
            },
        ],
        exports: [pricing_plan_service_1.PricingPlanService, 'IPricingPlanRepository'],
    })
], PricingPlanModule);
//# sourceMappingURL=pricing-plan.module.js.map