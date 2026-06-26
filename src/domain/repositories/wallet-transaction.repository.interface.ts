import { WalletTransactionEntity } from "../entities/wallet-transaction.entity";
import { WalletTransactionType, WalletRelatedEntityType } from "@prisma/client";

export interface IWalletTransactionRepository {
  create(walletId: string, type: WalletTransactionType, amount: number, description: string, relatedEntityId?: string, relatedEntityType?: WalletRelatedEntityType): Promise<WalletTransactionEntity>;
  findById(id: string): Promise<WalletTransactionEntity | null>;
  findByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
  findByRelatedEntity(relatedEntityId: string, relatedEntityType: WalletRelatedEntityType): Promise<WalletTransactionEntity[]>;
  getTotals(walletId: string): Promise<{ totalIn: number; totalOut: number }>;
}
