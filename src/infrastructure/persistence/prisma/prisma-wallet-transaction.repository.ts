import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IWalletTransactionRepository } from 'src/domain/repositories/wallet-transaction.repository.interface';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { WalletTransactionType, WalletRelatedEntityType, WalletTransaction as PrismaWalletTransaction } from '@prisma/client';
import { WalletTransactionMapper } from '../../mappers/wallet-transaction.mapper';

@Injectable()
export class PrismaWalletTransactionRepository implements IWalletTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    walletId: string,
    type: WalletTransactionType,
    amount: number,
    description: string,
    relatedEntityId?: string,
    relatedEntityType?: WalletRelatedEntityType,
  ): Promise<WalletTransactionEntity> {
    const prismaTransaction = await this.prisma.walletTransaction.create({
      data: {
        walletId,
        type,
        amount,
        description,
        relatedEntityId,
        relatedEntityType,
      },
    });
    return WalletTransactionMapper.toDomain(prismaTransaction);
  }

  async findById(id: string): Promise<WalletTransactionEntity | null> {
    const prismaTransaction = await this.prisma.walletTransaction.findUnique({
      where: { id },
      include: { wallet: true },
    });
    return prismaTransaction ? WalletTransactionMapper.toDomain(prismaTransaction) : null;
  }

  async findByWalletId(walletId: string): Promise<WalletTransactionEntity[]> {
    const prismaTransactions = await this.prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      include: { wallet: true },
    });
    return prismaTransactions.map(WalletTransactionMapper.toDomain);
  }

  async findByRelatedEntity(
    relatedEntityId: string,
    relatedEntityType: WalletRelatedEntityType,
  ): Promise<WalletTransactionEntity[]> {
    const prismaTransactions = await this.prisma.walletTransaction.findMany({
      where: { relatedEntityId, relatedEntityType },
      orderBy: { createdAt: 'desc' },
      include: { wallet: true },
    });
    return prismaTransactions.map(WalletTransactionMapper.toDomain);
  }

  async getTotals(walletId: string): Promise<{ totalIn: number; totalOut: number }> {
    const totals = await this.prisma.walletTransaction.groupBy({
      by: ['type'],
      where: { walletId },
      _sum: {
        amount: true,
      },
    });

    const result = { totalIn: 0, totalOut: 0 };
    totals.forEach((t) => {
      if (t.type === WalletTransactionType.CREDIT) {
        result.totalIn = t._sum.amount || 0;
      } else if (t.type === WalletTransactionType.DEBIT) {
        result.totalOut = t._sum.amount || 0;
      }
    });

    return result;
  }
}
