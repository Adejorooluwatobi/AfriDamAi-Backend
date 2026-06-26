import { WalletTransactionType, WalletRelatedEntityType } from "@prisma/client";
import { Wallet } from "./wallet.entity";
export declare class WalletTransactionEntity {
    id: string;
    walletId: string;
    wallet?: Wallet;
    type: WalletTransactionType;
    amount: number;
    description: string;
    relatedEntityId?: string;
    relatedEntityType?: WalletRelatedEntityType;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<WalletTransactionEntity>);
}
