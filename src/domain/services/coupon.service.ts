import { Inject, Injectable } from "@nestjs/common";
import type { CouponRepositoryInterface } from "../repositories/coupon.repository.interface";
import { CreateCouponParams } from "src/utils/type";
import { CouponEntity } from "../entities/coupon.entity";

@Injectable()
export class CouponService {
  constructor(@Inject('ICouponeRepository') private readonly couponRepository: CouponRepositoryInterface) {}

  async createCoupon(couponDetails: CreateCouponParams): Promise<CouponEntity> {
    const existingCoupon = await this.couponRepository.findByCode(couponDetails.code);
    if (existingCoupon) {
      throw new Error(`Coupon with code ${couponDetails.code} already exists`);
    }
    const  newCoupon = await this.couponRepository.create(couponDetails);
    return newCoupon;
  }

  async getCouponById(id: string): Promise<CouponEntity> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new Error(`Coupon with id ${id} not found`);
    }
    return coupon;
  }

  async getCouponByCode(code: string): Promise<CouponEntity> {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      throw new Error(`Coupon with code ${code} not found`);
    }
    return coupon;
  }

  async getAllCoupons(): Promise<CouponEntity[]> {
    return this.couponRepository.findAll();
  }

  async updateCoupon(id: string, couponDetails: CreateCouponParams): Promise<CouponEntity> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new Error(`Coupon with id ${id} not found`);
    }
    return this.couponRepository.update(id, couponDetails);
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new Error(`Coupon with id ${id} not found`);
    }
    await this.couponRepository.delete(id);
  }

}