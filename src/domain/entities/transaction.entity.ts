import { ApiProperty } from "@nestjs/swagger";

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentGateway {
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
    FLUTTERWAVE = 'FLUTTERWAVE',
    PAYSTACK = 'PAYSTACK',
}

export class TransactionEntity {
    @ApiProperty()
    id: string;

    @ApiProperty({ required: false })
    orderId?: string; // 🛡️ Made optional to support non-product payments

    @ApiProperty({ required: false })
    appointmentId?: string; // 🚀 Added to support specialist sessions

    @ApiProperty({ required: false })
    pricingPlanId?: string; // 🚀 Added to support subscription payments

    @ApiProperty({ required: false })
    subscriptionId?: string; // 🚀 Added to support subscription payments

    @ApiProperty()
    userId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: TransactionStatus })
    status: TransactionStatus;

    @ApiProperty({ enum: PaymentGateway })
    gateway: PaymentGateway;

    @ApiProperty({ required: false })
    gatewayTransactionId?: string;

    @ApiProperty({ required: false })
    paymentMethod?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<TransactionEntity>) {
        Object.assign(this, partial);
    }
}