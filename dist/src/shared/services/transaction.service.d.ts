export declare class TransactionService {
    private readonly logger;
    executeInTransaction<T>(operation: () => Promise<T>): Promise<T>;
    createOrderWithTransaction(_orderData: any, _paymentData: any): Promise<any>;
    reserveInventory(productId: string, quantity: number): Promise<boolean>;
    releaseInventory(productId: string, quantity: number): Promise<void>;
}
