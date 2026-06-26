export interface PaymentInitializeResult {
    authorizationUrl: string;
    reference: string;
}
export interface PaymentVerificationResult {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    gatewayTransactionId: string;
    amount: number;
    currency: string;
    metadata?: any;
}
export interface PaymentGatewayInterface {
    initializePayment(email: string, amount: number, metadata?: any, planCode?: string): Promise<PaymentInitializeResult>;
    verifyPayment(reference: string): Promise<PaymentVerificationResult>;
}
