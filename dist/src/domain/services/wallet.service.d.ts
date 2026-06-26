import { IWalletRepository } from '../repositories/wallet.repository.interface';
import { IWalletTransactionRepository } from '../repositories/wallet-transaction.repository.interface';
import { Wallet } from '../entities/wallet.entity';
import { CreateWalletParams, UpdateWalletParams } from 'src/utils/type';
import { WalletOwnerType, WalletRelatedEntityType } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IVendorRepository } from '../repositories/vendor.repository.interface';
import { ISpecialistRepository } from '../repositories/specialist.repository.interface';
import { IAdminRepository } from '../repositories/admin.repository.interface';
export declare class WalletService {
    private readonly walletRepository;
    private readonly walletTransactionRepository;
    private readonly userRepository;
    private readonly vendorRepository;
    private readonly specialistRepository;
    private readonly adminRepository;
    constructor(walletRepository: IWalletRepository, walletTransactionRepository: IWalletTransactionRepository, userRepository: IUserRepository, vendorRepository: IVendorRepository, specialistRepository: ISpecialistRepository, adminRepository: IAdminRepository);
    createWallet(params: CreateWalletParams): Promise<Wallet>;
    getWalletById(id: string): Promise<Wallet>;
    getWalletByOwner(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet>;
    findAllWalletsByOwnerType(ownerType: WalletOwnerType): Promise<Wallet[]>;
    deleteWallet(id: string): Promise<void>;
    creditWallet(walletId: string, amount: number): Promise<Wallet>;
    debitWallet(walletId: string, amount: number): Promise<Wallet>;
    transferFunds(fromWalletId: string, toWalletId: string, amount: number, description: string, relatedEntityId?: string, relatedEntityType?: WalletRelatedEntityType): Promise<{
        fromWallet: Wallet;
        toWallet: Wallet;
    }>;
    updateWallet(id: string, params: UpdateWalletParams): Promise<Wallet>;
    private validateOwner;
}
