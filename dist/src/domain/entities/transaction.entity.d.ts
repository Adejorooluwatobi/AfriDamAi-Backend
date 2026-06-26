export declare enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentGateway {
    STRIPE = "STRIPE",
    PAYPAL = "PAYPAL",
    FLUTTERWAVE = "FLUTTERWAVE",
    PAYSTACK = "PAYSTACK"
}
export declare class TransactionEntity {
    id: string;
    orderId?: string;
    appointmentId?: string;
    pricingPlanId?: string;
    subscriptionId?: string;
    userId: string;
    amount: number;
    status: TransactionStatus;
    gateway: PaymentGateway;
    gatewayTransactionId?: string;
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TransactionEntity>);
}
