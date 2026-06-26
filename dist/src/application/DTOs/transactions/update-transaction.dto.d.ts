export declare class UpdateTransactionDto {
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    gatewayTransactionId?: string;
    paymentMethod?: string;
}
