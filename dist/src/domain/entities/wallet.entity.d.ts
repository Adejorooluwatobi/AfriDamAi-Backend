import { WalletOwnerType } from "@prisma/client";
import { WalletTransactionEntity } from "./wallet-transaction.entity";
import { WithdrawalRequestEntity } from "./withdrawal-request.entity";
export declare class Wallet {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    balance: number;
    totalIn: number;
    totalOut: number;
    createdAt: Date;
    updatedAt: Date;
    transactions?: WalletTransactionEntity[];
    withdrawalRequests?: WithdrawalRequestEntity[];
    constructor(partial: Partial<Wallet>);
}
