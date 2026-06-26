import { TransactionService } from 'src/domain/services/transaction.service';
export declare class WebhookController {
    private readonly transactionService;
    private readonly logger;
    constructor(transactionService: TransactionService);
    handlePaystackWebhook(payload: any, signature: string): Promise<import("../../domain/entities/transaction.entity").TransactionEntity | {
        status: string;
    }>;
}
