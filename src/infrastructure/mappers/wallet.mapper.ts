import { Wallet } from "src/domain/entities/wallet.entity";
import { Wallet as PrismaWallet, WalletOwnerType } from "@prisma/client";
import { WalletTransactionMapper } from "./wallet-transaction.mapper";
import { WithdrawalRequestMapper } from "./withdrawal-request.mapper";

export class WalletMapper {
  static toDomain(prismaWallet: PrismaWallet & { transactions?: any[]; withdrawalRequests?: any[] }): Wallet {
    const wallet = new Wallet({
      id: prismaWallet.id,
      ownerId: prismaWallet.ownerId,
      ownerType: prismaWallet.ownerType,
      balance: prismaWallet.balance,
      createdAt: prismaWallet.createdAt,
      updatedAt: prismaWallet.updatedAt,
    });

    if (prismaWallet.transactions) {
      wallet.transactions = prismaWallet.transactions.map(WalletTransactionMapper.toDomain);
    }
    if (prismaWallet.withdrawalRequests) {
      wallet.withdrawalRequests = prismaWallet.withdrawalRequests.map(WithdrawalRequestMapper.toDomain);
    }

    return wallet;
  }

  static toPersistence(wallet: Partial<Wallet>): Partial<PrismaWallet> {
    return {
      id: wallet.id,
      ownerId: wallet.ownerId,
      ownerType: wallet.ownerType,
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  static toDomainArray(prismaWallets: PrismaWallet[]): Wallet[] {
    return prismaWallets.map(prismaWallet => WalletMapper.toDomain(prismaWallet));
  }
}
