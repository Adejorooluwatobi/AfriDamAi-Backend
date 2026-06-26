import { Injectable } from '@nestjs/common';
import { CouponRepositoryInterface } from 'src/domain/repositories/coupon.repository.interface';
import { CouponEntity } from 'src/domain/entities/coupon.entity';
import { CreateCouponParams, UpdateCouponParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { CouponMapper } from 'src/infrastructure/mappers/coupon.mapper';

@Injectable()
export class PrismaCouponRepository implements CouponRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateCouponParams): Promise<CouponEntity> {
        const coupon = await this.prisma.coupon.create({
            data: params,
        });
        return CouponMapper.toDomain(coupon);
    }

    async findById(id: string): Promise<CouponEntity | null> {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        return coupon ? CouponMapper.toDomain(coupon) : null;
    }

    async findByCode(code: string): Promise<CouponEntity | null> {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });
        return coupon ? CouponMapper.toDomain(coupon) : null;
    }

    async findAll(): Promise<CouponEntity[]> {
        const coupons = await this.prisma.coupon.findMany();
        return coupons.map(CouponMapper.toDomain);
    }

    async update(id: string, params: UpdateCouponParams): Promise<CouponEntity> {
        const coupon = await this.prisma.coupon.update({
            where: { id },
            data: params,
        });
        return CouponMapper.toDomain(coupon);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.coupon.delete({
            where: { id },
        });
    }
}