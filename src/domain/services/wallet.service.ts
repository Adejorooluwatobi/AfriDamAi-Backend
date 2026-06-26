import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { IWalletRepository } from '../repositories/wallet.repository.interface';
import { IWalletTransactionRepository } from '../repositories/wallet-transaction.repository.interface';
import { Wallet } from '../entities/wallet.entity';
import { CreateWalletParams, UpdateWalletParams } from 'src/utils/type';
import { WalletOwnerType, WalletRelatedEntityType } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IVendorRepository } from '../repositories/vendor.repository.interface';
import { ISpecialistRepository } from '../repositories/specialist.repository.interface';
import { IAdminRepository } from '../repositories/admin.repository.interface';

@Injectable()
export class WalletService {
  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    @Inject('IWalletTransactionRepository')
    private readonly walletTransactionRepository: IWalletTransactionRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,
    @Inject('ISpecialistRepository')
    private readonly specialistRepository: ISpecialistRepository,
    @Inject('IAdminRepository') // For Organization Wallet's 'owner'
    private readonly adminRepository: IAdminRepository,
  ) {}

  async createWallet(params: CreateWalletParams): Promise<Wallet> {
    const { ownerId, ownerType, initialBalance } = params;

    // Ensure owner exists
    await this.validateOwner(ownerId, ownerType);

    const existingWallet = await this.walletRepository.findByOwnerIdAndType(ownerId, ownerType);
    if (existingWallet) {
      throw new ConflictException(`Wallet already exists for ${ownerType} with ID ${ownerId}`);
    }

    return this.walletRepository.create(ownerId, ownerType, initialBalance);
  }

  async getWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    
    // Fetch and attach totals
    const totals = await this.walletTransactionRepository.getTotals(wallet.id);
    wallet.totalIn = totals.totalIn;
    wallet.totalOut = totals.totalOut;

    return wallet;
  }

  async getWalletByOwner(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet> {
    const wallet = await this.walletRepository.findByOwnerIdAndType(ownerId, ownerType);
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for ${ownerType} with ID ${ownerId}`);
    }

    // Fetch and attach totals
    const totals = await this.walletTransactionRepository.getTotals(wallet.id);
    wallet.totalIn = totals.totalIn;
    wallet.totalOut = totals.totalOut;

    return wallet;
  }

  async findAllWalletsByOwnerType(ownerType: WalletOwnerType): Promise<Wallet[]> {
    return this.walletRepository.findAllByOwnerType(ownerType);
  }

  async deleteWallet(id: string): Promise<void> {
    return this.walletRepository.delete(id);
  }

  async creditWallet(walletId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be positive');
    }
    return this.walletRepository.updateBalance(walletId, amount);
  }

  async debitWallet(walletId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be positive');
    }
    const wallet = await this.getWalletById(walletId);
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    return this.walletRepository.updateBalance(walletId, -amount); // Deduct by passing negative amount
  }

  async transferFunds(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    description: string,
    relatedEntityId?: string,
    relatedEntityType?: WalletRelatedEntityType,
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive');
    }

    const fromWallet = await this.getWalletById(fromWalletId);
    const toWallet = await this.getWalletById(toWalletId);

    if (fromWallet.balance < amount) {
      throw new BadRequestException(`Insufficient balance in wallet ${fromWalletId} for transfer`);
    }

    // Perform debit and credit operations within a transaction if possible with Prisma
    // For now, sequentially
    const debitedWallet = await this.debitWallet(fromWalletId, amount);
    const creditedWallet = await this.creditWallet(toWalletId, amount);

    // TODO: Also create WalletTransaction records for this transfer
    // This requires WalletTransactionService, which will be created next.

    return { fromWallet: debitedWallet, toWallet: creditedWallet };
  }

  async updateWallet(id: string, params: UpdateWalletParams): Promise<Wallet> {
    const existingWallet = await this.getWalletById(id);
    return this.walletRepository.update(id, { ...existingWallet, ...params });
  }

  private async validateOwner(ownerId: string, ownerType: WalletOwnerType): Promise<void> {
    switch (ownerType) {
      case WalletOwnerType.USER:
        const user = await this.userRepository.findById(ownerId);
        if (!user) throw new NotFoundException(`User with ID ${ownerId} not found`);
        break;
      case WalletOwnerType.VENDOR:
        const vendor = await this.vendorRepository.findById(ownerId);
        if (!vendor) throw new NotFoundException(`Vendor with ID ${ownerId} not found`);
        break;
      case WalletOwnerType.SPECIALIST:
        const specialist = await this.specialistRepository.findById(ownerId);
        if (!specialist) throw new NotFoundException(`Specialist with ID ${ownerId} not found`);
        break;
      case WalletOwnerType.ORGANIZATION:
        // For organization, we might have a single 'organization' entry or use a specific admin's ID
        // For simplicity, let's assume the 'organization' wallet is tied to a SUPER_ADMIN's ID initially
        // or a specific fixed ID that represents the organization.
        // For now, we'll allow an adminId to be the ownerId for the organization wallet.
        const admin = await this.adminRepository.findById(ownerId);
        if (!admin) throw new NotFoundException(`Admin (Organization Owner) with ID ${ownerId} not found`);
        break;
      default:
        throw new BadRequestException(`Invalid owner type: ${ownerType}`);
    }
  }
}
