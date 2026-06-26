import { CouponEntity } from 'src/domain/entities/coupon.entity';
import { Coupon } from '@prisma/client';

export class CouponMapper {
    static toDomain(prismaCoupon: Coupon): CouponEntity {
        return new CouponEntity({
            id: prismaCoupon.id,
            code: prismaCoupon.code,
            discountType: prismaCoupon.discountType as 'PERCENTAGE' | 'FIXED',
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

    static toPrisma(coupon: CouponEntity): Omit<Coupon, 'createdAt' | 'updatedAt'> {
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