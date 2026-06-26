import { PrismaService } from './prisma.service';
import { IWalletRepository } from 'src/domain/repositories/wallet.repository.interface';
import { Wallet } from 'src/domain/entities/wallet.entity';
import { WalletOwnerType } from '@prisma/client';
export declare class PrismaWalletRepository implements IWalletRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(ownerId: string, ownerType: WalletOwnerType, initialBalance?: number): Promise<Wallet>;
    findById(id: string): Promise<Wallet | null>;
    findByOwnerIdAndType(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet | null>;
    findAllByOwnerType(ownerType: WalletOwnerType): Promise<Wallet[]>;
    updateBalance(id: string, amount: number): Promise<Wallet>;
    update(id: string, data: Partial<Wallet>): Promise<Wallet>;
    delete(id: string): Promise<void>;
}
