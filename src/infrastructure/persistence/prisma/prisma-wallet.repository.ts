import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IWalletRepository } from 'src/domain/repositories/wallet.repository.interface';
import { Wallet } from 'src/domain/entities/wallet.entity';
import { WalletOwnerType, Wallet as PrismaWallet } from '@prisma/client';
import { WalletMapper } from '../../mappers/wallet.mapper';

@Injectable()
export class PrismaWalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, ownerType: WalletOwnerType, initialBalance: number = 0): Promise<Wallet> {
    const prismaWallet = await this.prisma.wallet.create({
      data: {
        ownerId,
        ownerType,
        balance: initialBalance,
      },
    });
    return WalletMapper.toDomain(prismaWallet);
  }

  async findById(id: string): Promise<Wallet | null> {
    const prismaWallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: { transactions: true, withdrawalRequests: true }, // Include relations for comprehensive view
    });
    return prismaWallet ? WalletMapper.toDomain(prismaWallet) : null;
  }

  async findByOwnerIdAndType(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet | null> {
    const prismaWallet = await this.prisma.wallet.findUnique({
      where: {
        ownerId_ownerType: {
          ownerId,
          ownerType,
        },
      },
      include: { transactions: true, withdrawalRequests: true },
    });
    return prismaWallet ? WalletMapper.toDomain(prismaWallet) : null;
  }

  async findAllByOwnerType(ownerType: WalletOwnerType): Promise<Wallet[]> {
    const prismaWallets = await this.prisma.wallet.findMany({
      where: { ownerType },
      include: { transactions: true, withdrawalRequests: true },
    });
    return prismaWallets.map(WalletMapper.toDomain);
  }

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const prismaWallet = await this.prisma.wallet.update({
      where: { id },
      data: {
        balance: {
          increment: amount, // Handles both credit (positive amount) and debit (negative amount)
        },
      },
    });
    return WalletMapper.toDomain(prismaWallet);
  }

  async update(id: string, data: Partial<Wallet>): Promise<Wallet> {
    const prismaWallet = await this.prisma.wallet.update({
      where: { id },
      data: WalletMapper.toPersistence(data as Wallet),
    });
    return WalletMapper.toDomain(prismaWallet);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.wallet.delete({ where: { id } });
  }
}
