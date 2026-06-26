import { CouponEntity } from '../entities/coupon.entity';
import { CreateCouponParams, UpdateCouponParams } from 'src/utils/type';

export interface CouponRepositoryInterface {
    create(params: CreateCouponParams): Promise<CouponEntity>;
    findById(id: string): Promise<CouponEntity | null>;
    findByCode(code: string): Promise<CouponEntity | null>;
    findAll(): Promise<CouponEntity[]>;
    update(id: string, params: UpdateCouponParams): Promise<CouponEntity>;
    delete(id: string): Promise<void>;
}