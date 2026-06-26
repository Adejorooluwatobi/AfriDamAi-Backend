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
exports.PricingPlanController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pricing_plan_service_1 = require("../../domain/services/pricing-plan.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_pricing_plan_dto_1 = require("../../application/DTOs/pricing-plans/create-pricing-plan.dto");
const update_pricing_plan_dto_1 = require("../../application/DTOs/pricing-plans/update-pricing-plan.dto");
let PricingPlanController = class PricingPlanController {
    constructor(pricingPlanService) {
        this.pricingPlanService = pricingPlanService;
    }
    async getActivePricingPlans() {
        return this.pricingPlanService.getActivePlans();
    }
    async seedDefaultPricingPlans() {
        return this.pricingPlanService.seedDefaultPricingPlans();
    }
    async findAll() {
        return this.pricingPlanService.findAll();
    }
    async create(createPricingPlanDto) {
        return this.pricingPlanService.create(createPricingPlanDto);
    }
    async findOne(id) {
        return this.pricingPlanService.findOne(id);
    }
    async update(id, updatePricingPlanDto) {
        return this.pricingPlanService.update(id, updatePricingPlanDto);
    }
    async remove(id) {
        return this.pricingPlanService.delete(id);
    }
};
exports.PricingPlanController = PricingPlanController;
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active pricing plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active pricing plans retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "getActivePricingPlans", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Seed default pricing plans' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Default pricing plans seeded successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "seedDefaultPricingPlans", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pricing plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing plans retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create pricing plan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pricing plan created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pricing_plan_dto_1.CreatePricingPlanDto]),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pricing plan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing plan retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pricing plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing plan updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pricing_plan_dto_1.UpdatePricingPlanDto]),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pricing plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing plan deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingPlanController.prototype, "remove", null);
exports.PricingPlanController = PricingPlanController = __decorate([
    (0, swagger_1.ApiTags)('Pricing Plans'),
    (0, common_1.Controller)('pricing-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [pricing_plan_service_1.PricingPlanService])
], PricingPlanController);
//# sourceMappingURL=pricing-plan.controller.js.map