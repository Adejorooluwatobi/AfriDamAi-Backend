export declare class CreateCouponDto {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: Date;
}
