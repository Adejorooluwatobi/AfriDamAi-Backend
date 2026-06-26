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
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
let CouponService = class CouponService {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async createCoupon(couponDetails) {
        const existingCoupon = await this.couponRepository.findByCode(couponDetails.code);
        if (existingCoupon) {
            throw new Error(`Coupon with code ${couponDetails.code} already exists`);
        }
        const newCoupon = await this.couponRepository.create(couponDetails);
        return newCoupon;
    }
    async getCouponById(id) {
        const coupon = await this.couponRepository.findById(id);
        if (!coupon) {
            throw new Error(`Coupon with id ${id} not found`);
        }
        return coupon;
    }
    async getCouponByCode(code) {
        const coupon = await this.couponRepository.findByCode(code);
        if (!coupon) {
            throw new Error(`Coupon with code ${code} not found`);
        }
        return coupon;
    }
    async getAllCoupons() {
        return this.couponRepository.findAll();
    }
    async updateCoupon(id, couponDetails) {
        const coupon = await this.couponRepository.findById(id);
        if (!coupon) {
            throw new Error(`Coupon with id ${id} not found`);
        }
        return this.couponRepository.update(id, couponDetails);
    }
    async deleteCoupon(id) {
        const coupon = await this.couponRepository.findById(id);
        if (!coupon) {
            throw new Error(`Coupon with id ${id} not found`);
        }
        await this.couponRepository.delete(id);
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICouponeRepository')),
    __metadata("design:paramtypes", [Object])
], CouponService);
//# sourceMappingURL=coupon.service.js.map