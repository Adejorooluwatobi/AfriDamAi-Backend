import { ITransactionRepository } from 'src/domain/repositories/transaction.repository.interface';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { CreateTransactionParams, UpdateTransactionParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaTransactionRepository implements ITransactionRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateTransactionParams): Promise<TransactionEntity>;
    get(): Promise<TransactionEntity[]>;
    findById(id: string): Promise<TransactionEntity | null>;
    findByOrderId(orderId: string): Promise<TransactionEntity | null>;
    findByAppointmentId(appointmentId: string): Promise<TransactionEntity | null>;
    findByGatewayTransactionId(gatewayTransactionId: string): Promise<TransactionEntity | null>;
    findByUserId(userId: string): Promise<TransactionEntity[]>;
    update(id: string, params: UpdateTransactionParams): Promise<TransactionEntity>;
    delete(id: string): Promise<void>;
    findPendingTransactionsOlderThan(date: Date): Promise<TransactionEntity[]>;
}
