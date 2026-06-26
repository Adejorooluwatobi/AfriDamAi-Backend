import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransactionParams, UpdateTransactionParams } from 'src/utils/type';
export interface ITransactionRepository {
    create(params: CreateTransactionParams): Promise<TransactionEntity>;
    get(): Promise<TransactionEntity[]>;
    findById(id: string): Promise<TransactionEntity | null>;
    findByOrderId(order_id: string): Promise<TransactionEntity | null>;
    findByAppointmentId(appointmentId: string): Promise<TransactionEntity | null>;
    findByGatewayTransactionId(gatewayTransactionId: string): Promise<TransactionEntity | null>;
    findByUserId(userId: string): Promise<TransactionEntity[]>;
    update(id: string, params: UpdateTransactionParams): Promise<TransactionEntity>;
    delete(id: string): Promise<void>;
    findPendingTransactionsOlderThan(date: Date): Promise<TransactionEntity[]>;
}
