import { ApiProperty } from "@nestjs/swagger";

export class CouponEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty({ enum: ['PERCENTAGE', 'FIXED'] })
    discountType: 'PERCENTAGE' | 'FIXED';

    @ApiProperty()
    discountValue: number;

    @ApiProperty({ required: false })
    minOrderAmount?: number;

    @ApiProperty({ required: false })
    maxUses?: number;

    @ApiProperty()
    usedCount: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty({ required: false })
    expiresAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<CouponEntity>) {
        Object.assign(this, partial);
    }
}