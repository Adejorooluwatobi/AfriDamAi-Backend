import { TransactionService } from 'src/domain/services/transaction.service';
import { CreateTransactionDto } from '../../application/DTOs/transactions/create-transaction.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    initiateTransaction(req: any, createTransactionDto: CreateTransactionDto): Promise<{
        transaction: import("../../domain/entities/transaction.entity").TransactionEntity;
        authorizationUrl: string;
    }>;
    verifyPayment(id: string): Promise<import("../../domain/entities/transaction.entity").TransactionEntity>;
    getTransaction(id: string): Promise<import("../../domain/entities/transaction.entity").TransactionEntity>;
    getAllTransaction(): Promise<import("../../domain/entities/transaction.entity").TransactionEntity[]>;
    getTransactionByRef(ref: string): Promise<import("../../domain/entities/transaction.entity").TransactionEntity>;
}
