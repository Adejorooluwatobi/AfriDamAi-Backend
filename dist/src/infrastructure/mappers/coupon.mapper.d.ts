import { CouponEntity } from 'src/domain/entities/coupon.entity';
import { Coupon } from '@prisma/client';
export declare class CouponMapper {
    static toDomain(prismaCoupon: Coupon): CouponEntity;
    static toPrisma(coupon: CouponEntity): Omit<Coupon, 'createdAt' | 'updatedAt'>;
}
