import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IWithdrawalRequestRepository } from 'src/domain/repositories/withdrawal-request.repository.interface';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
import { WithdrawalStatus, WalletOwnerType, WithdrawalRequest as PrismaWithdrawalRequest } from '@prisma/client';
import { WithdrawalRequestMapper } from '../../mappers/withdrawal-request.mapper';

@Injectable()
export class PrismaWithdrawalRequestRepository implements IWithdrawalRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(walletId: string, amount: number, requestedById: string, requestedByType: WalletOwnerType): Promise<WithdrawalRequestEntity> {
    const prismaRequest = await this.prisma.withdrawalRequest.create({
      data: {
        walletId,
        amount,
        requestedById,
        requestedByType,
        status: WithdrawalStatus.PENDING,
      },
    });
    return WithdrawalRequestMapper.toDomain(prismaRequest);
  }

  async findById(id: string): Promise<WithdrawalRequestEntity | null> {
    const prismaRequest = await this.prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { wallet: true },
    });
    return prismaRequest ? WithdrawalRequestMapper.toDomain(prismaRequest) : null;
  }

  async findByWalletId(walletId: string): Promise<WithdrawalRequestEntity[]> {
    const prismaRequests = await this.prisma.withdrawalRequest.findMany({
      where: { walletId },
      orderBy: { requestedAt: 'desc' },
      include: { wallet: true },
    });
    return prismaRequests.map(WithdrawalRequestMapper.toDomain);
  }

  async findByStatus(status: WithdrawalStatus): Promise<WithdrawalRequestEntity[]> {
    const prismaRequests = await this.prisma.withdrawalRequest.findMany({
      where: { status },
      orderBy: { requestedAt: 'desc' },
      include: { wallet: true },
    });
    return prismaRequests.map(WithdrawalRequestMapper.toDomain);
  }

  async update(id: string, data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity> {
    const prismaRequest = await this.prisma.withdrawalRequest.update({
      where: { id },
      data: WithdrawalRequestMapper.toPersistence(data as WithdrawalRequestEntity),
    });
    return WithdrawalRequestMapper.toDomain(prismaRequest);
  }
}
