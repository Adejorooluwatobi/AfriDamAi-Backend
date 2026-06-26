import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { Transaction } from '@prisma/client';
export declare class TransactionMapper {
    static toDomain(prismaTransaction: Transaction): TransactionEntity;
    static toPrisma(transaction: TransactionEntity): Omit<Transaction, 'createdAt' | 'updatedAt'>;
}
