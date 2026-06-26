import { WithdrawalRequestEntity } from "../entities/withdrawal-request.entity";
import { WithdrawalStatus, WalletOwnerType } from "@prisma/client";
export interface IWithdrawalRequestRepository {
    create(walletId: string, amount: number, requestedById: string, requestedByType: WalletOwnerType): Promise<WithdrawalRequestEntity>;
    findById(id: string): Promise<WithdrawalRequestEntity | null>;
    findByWalletId(walletId: string): Promise<WithdrawalRequestEntity[]>;
    findByStatus(status: WithdrawalStatus): Promise<WithdrawalRequestEntity[]>;
    update(id: string, data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
}
