export declare class CouponEntity {
    id: string;
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number;
    usedCount: number;
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CouponEntity>);
}
