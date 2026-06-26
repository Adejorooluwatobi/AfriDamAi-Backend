import { WalletTransactionEntity } from "src/domain/entities/wallet-transaction.entity";
import { WalletTransaction as PrismaWalletTransaction } from "@prisma/client";
export declare class WalletTransactionMapper {
    static toDomain(prismaTransaction: PrismaWalletTransaction & {
        wallet?: any;
    }): WalletTransactionEntity;
    static toPersistence(transaction: Partial<WalletTransactionEntity>): Partial<PrismaWalletTransaction>;
}
