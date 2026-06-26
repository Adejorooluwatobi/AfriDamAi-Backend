import type { CouponRepositoryInterface } from "../repositories/coupon.repository.interface";
import { CreateCouponParams } from "src/utils/type";
import { CouponEntity } from "../entities/coupon.entity";
export declare class CouponService {
    private readonly couponRepository;
    constructor(couponRepository: CouponRepositoryInterface);
    createCoupon(couponDetails: CreateCouponParams): Promise<CouponEntity>;
    getCouponById(id: string): Promise<CouponEntity>;
    getCouponByCode(code: string): Promise<CouponEntity>;
    getAllCoupons(): Promise<CouponEntity[]>;
    updateCoupon(id: string, couponDetails: CreateCouponParams): Promise<CouponEntity>;
    deleteCoupon(id: string): Promise<void>;
}
