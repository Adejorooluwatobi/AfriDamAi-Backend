import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { WalletTransaction as PrismaWalletTransaction } from "@prisma/client";
import { WalletMapper } from "./wallet.mapper";

export class WalletTransactionMapper {
  static toDomain(prismaTransaction: PrismaWalletTransaction & { wallet?: any }): WalletTransactionEntity {
    const transaction = new WalletTransactionEntity({
      id: prismaTransaction.id,
      walletId: prismaTransaction.walletId,
      type: prismaTransaction.type,
      amount: prismaTransaction.amount,
      description: prismaTransaction.description,
      relatedEntityId: prismaTransaction.relatedEntityId,
      relatedEntityType: prismaTransaction.relatedEntityType,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });

    if (prismaTransaction.wallet) {
      transaction.wallet = WalletMapper.toDomain(prismaTransaction.wallet);
    }

    return transaction;
  }

  static toPersistence(transaction: Partial<WalletTransactionEntity>): Partial<PrismaWalletTransaction> {
    return {
      id: transaction.id,
      walletId: transaction.walletId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      relatedEntityId: transaction.relatedEntityId,
      relatedEntityType: transaction.relatedEntityType,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
