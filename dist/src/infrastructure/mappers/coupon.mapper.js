"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponMapper = void 0;
const coupon_entity_1 = require("../../domain/entities/coupon.entity");
class CouponMapper {
    static toDomain(prismaCoupon) {
        return new coupon_entity_1.CouponEntity({
            id: prismaCoupon.id,
            code: prismaCoupon.code,
            discountType: prismaCoupon.discountType,
            discountValue: prismaCoupon.discountValue,
            minOrderAmount: prismaCoupon.minOrderAmount ?? undefined,
            maxUses: prismaCoupon.maxUses ?? undefined,
            usedCount: prismaCoupon.usedCount,
            isActive: prismaCoupon.isActive,
            expiresAt: prismaCoupon.expiresAt ?? undefined,
            createdAt: prismaCoupon.createdAt,
            updatedAt: prismaCoupon.updatedAt,
        });
    }
    static toPrisma(coupon) {
        return {
            id: coupon.id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount ?? null,
            maxUses: coupon.maxUses ?? null,
            usedCount: coupon.usedCount,
            isActive: coupon.isActive,
            expiresAt: coupon.expiresAt ?? null,
        };
    }
}
exports.CouponMapper = CouponMapper;
//# sourceMappingURL=coupon.mapper.js.map