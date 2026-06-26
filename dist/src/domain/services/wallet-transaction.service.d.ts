import { IWalletTransactionRepository } from '../repositories/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from '../entities/wallet-transaction.entity';
import { CreateWalletTransactionParams } from 'src/utils/type';
import { WalletRelatedEntityType } from '@prisma/client';
export declare class WalletTransactionService {
    private readonly walletTransactionRepository;
    constructor(walletTransactionRepository: IWalletTransactionRepository);
    createWalletTransaction(params: CreateWalletTransactionParams): Promise<WalletTransactionEntity>;
    getWalletTransactionById(id: string): Promise<WalletTransactionEntity>;
    getWalletTransactionsByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
    getWalletTransactionsByRelatedEntity(relatedEntityId: string, relatedEntityType: WalletRelatedEntityType): Promise<WalletTransactionEntity[]>;
}
