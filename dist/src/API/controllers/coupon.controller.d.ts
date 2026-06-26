import { CouponEntity } from "src/domain/entities/coupon.entity";
import { CreateCouponDto } from "src/application/DTOs/coupons/create-coupon.dto";
import { CouponService } from "src/domain/services/coupon.service";
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    create(couponDetails: CreateCouponDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CouponEntity;
    }>;
    getAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CouponEntity[];
    }>;
    getById(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CouponEntity;
    }>;
    getByCode(code: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CouponEntity;
    }>;
    update(id: string, couponDetails: CreateCouponDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: CouponEntity;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
}
