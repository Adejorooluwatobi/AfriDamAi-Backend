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
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coupon_entity_1 = require("../../domain/entities/coupon.entity");
const create_coupon_dto_1 = require("../../application/DTOs/coupons/create-coupon.dto");
const coupon_service_1 = require("../../domain/services/coupon.service");
const guards_1 = require("../auth/guards");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
    }
    async create(couponDetails) {
        const coupon = await this.couponService.createCoupon(couponDetails);
        return {
            succeeded: true,
            message: 'Coupon created successfully',
            resultData: coupon
        };
    }
    async getAll() {
        const coupons = await this.couponService.getAllCoupons();
        return {
            succeeded: true,
            message: 'Coupons retrieved successfully',
            resultData: coupons
        };
    }
    async getById(id) {
        const coupon = await this.couponService.getCouponById(id);
        return {
            succeeded: true,
            message: 'Coupon retrieved successfully',
            resultData: coupon
        };
    }
    async getByCode(code) {
        const coupon = await this.couponService.getCouponByCode(code);
        return {
            succeeded: true,
            message: 'Coupon retrieved successfully',
            resultData: coupon
        };
    }
    async update(id, couponDetails) {
        const coupon = await this.couponService.updateCoupon(id, couponDetails);
        return {
            succeeded: true,
            message: 'Coupon updated successfully',
            resultData: coupon
        };
    }
    async delete(id) {
        await this.couponService.deleteCoupon(id);
        return {
            succeeded: true,
            message: 'Coupon deleted successfully'
        };
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new coupon' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Coupon created successfully', type: coupon_entity_1.CouponEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons retrieved successfully', type: [coupon_entity_1.CouponEntity] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a coupon by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon retrieved successfully', type: coupon_entity_1.CouponEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a coupon by code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon retrieved successfully', type: coupon_entity_1.CouponEntity }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a coupon by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon updated successfully', type: coupon_entity_1.CouponEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a coupon by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "delete", null);
exports.CouponController = CouponController = __decorate([
    (0, swagger_1.ApiExtraModels)(),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupon.controller.js.map