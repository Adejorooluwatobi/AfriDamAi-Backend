import { Wallet } from "src/domain/entities/wallet.entity";
import { Wallet as PrismaWallet } from "@prisma/client";
export declare class WalletMapper {
    static toDomain(prismaWallet: PrismaWallet & {
        transactions?: any[];
        withdrawalRequests?: any[];
    }): Wallet;
    static toPersistence(wallet: Partial<Wallet>): Partial<PrismaWallet>;
    static toDomainArray(prismaWallets: PrismaWallet[]): Wallet[];
}
