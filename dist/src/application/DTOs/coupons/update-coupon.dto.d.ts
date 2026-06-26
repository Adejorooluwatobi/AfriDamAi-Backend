export declare class UpdateCouponDto {
    code?: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
}
