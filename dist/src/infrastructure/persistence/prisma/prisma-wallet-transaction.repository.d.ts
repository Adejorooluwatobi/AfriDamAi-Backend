import { PrismaService } from './prisma.service';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { WalletTransactionType, WalletRelatedEntityType } from '@prisma/client';
export declare class PrismaWalletTransactionRepository implements IWalletTransactionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(walletId: string, type: WalletTransactionType, amount: number, description: string, relatedEntityId?: string, relatedEntityType?: WalletRelatedEntityType): Promise<WalletTransactionEntity>;
    findById(id: string): Promise<WalletTransactionEntity | null>;
    findByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
    findByRelatedEntity(relatedEntityId: string, relatedEntityType: WalletRelatedEntityType): Promise<WalletTransactionEntity[]>;
    getTotals(walletId: string): Promise<{
        totalIn: number;
        totalOut: number;
    }>;
}
