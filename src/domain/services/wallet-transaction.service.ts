import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IWalletTransactionRepository } from '../repositories/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from '../entities/wallet-transaction.entity';
import { CreateWalletTransactionParams } from 'src/utils/type';
import { WalletRelatedEntityType, WalletTransactionType } from '@prisma/client';

@Injectable()
export class WalletTransactionService {
  constructor(
    @Inject('IWalletTransactionRepository')
    private readonly walletTransactionRepository: IWalletTransactionRepository,
  ) {}

  async createWalletTransaction(params: CreateWalletTransactionParams): Promise<WalletTransactionEntity> {
    const { walletId, type, amount, description, relatedEntityId, relatedEntityType } = params;
    return this.walletTransactionRepository.create(walletId, type, amount, description, relatedEntityId, relatedEntityType);
  }

  async getWalletTransactionById(id: string): Promise<WalletTransactionEntity> {
    const transaction = await this.walletTransactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException(`Wallet Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async getWalletTransactionsByWalletId(walletId: string): Promise<WalletTransactionEntity[]> {
    return this.walletTransactionRepository.findByWalletId(walletId);
  }

  async getWalletTransactionsByRelatedEntity(relatedEntityId: string, relatedEntityType: WalletRelatedEntityType): Promise<WalletTransactionEntity[]> {
    return this.walletTransactionRepository.findByRelatedEntity(relatedEntityId, relatedEntityType);
  }
}
