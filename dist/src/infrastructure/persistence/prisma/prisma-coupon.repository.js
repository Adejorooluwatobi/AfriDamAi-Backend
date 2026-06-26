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
exports.PrismaCouponRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const coupon_mapper_1 = require("../../mappers/coupon.mapper");
let PrismaCouponRepository = class PrismaCouponRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const coupon = await this.prisma.coupon.create({
            data: params,
        });
        return coupon_mapper_1.CouponMapper.toDomain(coupon);
    }
    async findById(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        return coupon ? coupon_mapper_1.CouponMapper.toDomain(coupon) : null;
    }
    async findByCode(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });
        return coupon ? coupon_mapper_1.CouponMapper.toDomain(coupon) : null;
    }
    async findAll() {
        const coupons = await this.prisma.coupon.findMany();
        return coupons.map(coupon_mapper_1.CouponMapper.toDomain);
    }
    async update(id, params) {
        const coupon = await this.prisma.coupon.update({
            where: { id },
            data: params,
        });
        return coupon_mapper_1.CouponMapper.toDomain(coupon);
    }
    async delete(id) {
        await this.prisma.coupon.delete({
            where: { id },
        });
    }
};
exports.PrismaCouponRepository = PrismaCouponRepository;
exports.PrismaCouponRepository = PrismaCouponRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCouponRepository);
//# sourceMappingURL=prisma-coupon.repository.js.map