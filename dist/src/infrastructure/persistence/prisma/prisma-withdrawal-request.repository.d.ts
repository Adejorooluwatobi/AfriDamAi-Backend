import { PrismaService } from './prisma.service';
import { IWithdrawalRequestRepository } from 'src/domain/repositories/withdrawal-request.repository.interface';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
import { WithdrawalStatus, WalletOwnerType } from '@prisma/client';
export declare class PrismaWithdrawalRequestRepository implements IWithdrawalRequestRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(walletId: string, amount: number, requestedById: string, requestedByType: WalletOwnerType): Promise<WithdrawalRequestEntity>;
    findById(id: string): Promise<WithdrawalRequestEntity | null>;
    findByWalletId(walletId: string): Promise<WithdrawalRequestEntity[]>;
    findByStatus(status: WithdrawalStatus): Promise<WithdrawalRequestEntity[]>;
    update(id: string, data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
}
