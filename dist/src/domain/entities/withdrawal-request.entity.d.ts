import { WithdrawalStatus, WalletOwnerType } from "@prisma/client";
import { Wallet } from "./wallet.entity";
export declare class WithdrawalRequestEntity {
    id: string;
    walletId: string;
    wallet?: Wallet;
    amount: number;
    status: WithdrawalStatus;
    requestedById: string;
    requestedByType: WalletOwnerType;
    approvedById?: string;
    requestedAt: Date;
    approvedAt?: Date;
    paidAt?: Date;
    adminNotes?: string;
    constructor(partial: Partial<WithdrawalRequestEntity>);
}
