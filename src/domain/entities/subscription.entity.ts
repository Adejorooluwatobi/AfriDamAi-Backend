import { ApiProperty } from "@nestjs/swagger";

export enum SubscriptionStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

export class UserSubscriptionEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    planId: string;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate?: Date; // Optional for lifetime
    
    @ApiProperty()
    remainingSessions?: number; // Counter for the plan limit
    @ApiProperty({ enum: SubscriptionStatus })
    status: SubscriptionStatus;

    @ApiProperty()
    autoRenew: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    gatewaySubscriptionId?: string;
    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<UserSubscriptionEntity>) {
        Object.assign(this, partial);
    }
}
