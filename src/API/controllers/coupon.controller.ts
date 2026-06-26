import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiExtraModels, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CouponEntity } from "src/domain/entities/coupon.entity";
import { CreateCouponDto } from "src/application/DTOs/coupons/create-coupon.dto";
import { CouponService } from "src/domain/services/coupon.service";
import { AdminGuard } from "../auth/guards";

@ApiExtraModels()
@Controller('coupons')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Post()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Create a new coupon' })
    @ApiResponse({ status: 201, description: 'Coupon created successfully', type: CouponEntity })
    async create(@Body() couponDetails: CreateCouponDto) {
        const coupon = await this.couponService.createCoupon(couponDetails);
        return {
            succeeded: true,
            message: 'Coupon created successfully',
            resultData: coupon
        };
    }

    @Get()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Get all coupons' })
    @ApiResponse({ status: 200, description: 'Coupons retrieved successfully', type: [CouponEntity] })
    async getAll() {
        const coupons = await this.couponService.getAllCoupons();
        return {
            succeeded: true,
            message: 'Coupons retrieved successfully',
            resultData: coupons
        };
    }

    @Get(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Get a coupon by id' })
    @ApiResponse({ status: 200, description: 'Coupon retrieved successfully', type: CouponEntity })
    async getById(@Param('id') id: string) {
        const coupon = await this.couponService.getCouponById(id);
        return {
            succeeded: true,
            message: 'Coupon retrieved successfully',
            resultData: coupon
        };
    }

    @Get(':code')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Get a coupon by code' })
    @ApiResponse({ status: 200, description: 'Coupon retrieved successfully', type: CouponEntity })
    async getByCode(@Param('code') code: string) {
        const coupon = await this.couponService.getCouponByCode(code);
        return {
            succeeded: true,
            message: 'Coupon retrieved successfully',
            resultData: coupon
        };
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Update a coupon by id' })
    @ApiResponse({ status: 200, description: 'Coupon updated successfully', type: CouponEntity })
    async update(@Param('id') id: string, @Body() couponDetails: CreateCouponDto) {
        const coupon = await this.couponService.updateCoupon(id, couponDetails);
        return {
            succeeded: true,
            message: 'Coupon updated successfully',
            resultData: coupon
        };
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Delete a coupon by id' })
    async delete(@Param('id') id: string) {
        await this.couponService.deleteCoupon(id);
        return {
            succeeded: true,
            message: 'Coupon deleted successfully'
        };
    }
}