import { CouponRepositoryInterface } from 'src/domain/repositories/coupon.repository.interface';
import { CouponEntity } from 'src/domain/entities/coupon.entity';
import { CreateCouponParams, UpdateCouponParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaCouponRepository implements CouponRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateCouponParams): Promise<CouponEntity>;
    findById(id: string): Promise<CouponEntity | null>;
    findByCode(code: string): Promise<CouponEntity | null>;
    findAll(): Promise<CouponEntity[]>;
    update(id: string, params: UpdateCouponParams): Promise<CouponEntity>;
    delete(id: string): Promise<void>;
}
