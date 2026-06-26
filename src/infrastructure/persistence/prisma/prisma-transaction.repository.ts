import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository.interface';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { CreateTransactionParams, UpdateTransactionParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { TransactionMapper } from 'src/infrastructure/mappers/transaction.mapper';
import { Transaction } from '@prisma/client';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateTransactionParams): Promise<TransactionEntity> {
        const transaction = await this.prisma.transaction.create({
            data: params as Transaction,
        });
        return TransactionMapper.toDomain(transaction);
    }

    async get(): Promise<TransactionEntity[]> {
        const transaction = await this.prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return transaction.map(TransactionMapper.toDomain);
    }

    async findById(id: string): Promise<TransactionEntity | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });
        return transaction ? TransactionMapper.toDomain(transaction) : null;
    }

    async findByOrderId(orderId: string): Promise<TransactionEntity | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { orderId },
        });
        return transaction ? TransactionMapper.toDomain(transaction) : null;
    }

    // 🛡️ NEW: Support for finding transactions linked to specialized medical appointments
    async findByAppointmentId(appointmentId: string): Promise<TransactionEntity | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { appointmentId },
        });
        return transaction ? TransactionMapper.toDomain(transaction) : null;
    }

    async findByGatewayTransactionId(gatewayTransactionId: string): Promise<TransactionEntity | null> {
        const transaction = await this.prisma.transaction.findFirst({
            where: { gatewayTransactionId },
        });
        return transaction ? TransactionMapper.toDomain(transaction) : null;
    }

    async findByUserId(userId: string): Promise<TransactionEntity[]> {
        const transactions = await this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return transactions.map(TransactionMapper.toDomain);
    }

    async update(id: string, params: UpdateTransactionParams): Promise<TransactionEntity> {
        const transaction = await this.prisma.transaction.update({
            where: { id },
            data: params,
        });
        return TransactionMapper.toDomain(transaction);
    }

    async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async findPendingTransactionsOlderThan(date: Date): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: date,
        },
      },
    });
    return transactions.map(TransactionMapper.toDomain);
  }
}