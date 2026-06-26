export declare class CreateTransactionDto {
    orderId?: string;
    appointmentId?: string;
    pricingPlanId?: string;
    subscriptionId?: string;
    userId: string;
    amount: number;
    gateway: 'STRIPE' | 'PAYPAL' | 'FLUTTERWAVE' | 'PAYSTACK';
    gatewayTransactionId?: string;
    paymentMethod?: string;
}
