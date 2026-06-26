import { TransactionEntity, TransactionStatus as EntityTransactionStatus, PaymentGateway as EntityPaymentGateway } from 'src/domain/entities/transaction.entity';
import { Transaction } from '@prisma/client';

export class TransactionMapper {
    static toDomain(prismaTransaction: Transaction): TransactionEntity {
        return new TransactionEntity({
            id: prismaTransaction.id,
            // 🛡️ Bridging the gap: These can now be null in Prisma but optional in Domain
            orderId: prismaTransaction.orderId ?? undefined,
            appointmentId: (prismaTransaction as any).appointmentId ?? undefined,
            userId: prismaTransaction.userId,
            amount: prismaTransaction.amount,
            status: prismaTransaction.status as EntityTransactionStatus,
            subscriptionId: prismaTransaction.subscriptionId ?? undefined,
            pricingPlanId: prismaTransaction.pricingPlanId ?? undefined,
            gateway: prismaTransaction.gateway as EntityPaymentGateway,
            gatewayTransactionId: prismaTransaction.gatewayTransactionId ?? undefined,
            paymentMethod: prismaTransaction.paymentMethod ?? undefined,
            createdAt: prismaTransaction.createdAt,
            updatedAt: prismaTransaction.updatedAt,
        });
    }

    static toPrisma(transaction: TransactionEntity): Omit<Transaction, 'createdAt' | 'updatedAt'> {
        return {
            id: transaction.id,
            // 🚀 Converting optional domain fields back to Prisma-friendly nulls
            orderId: transaction.orderId ?? null,
            appointmentId: (transaction as any).appointmentId ?? null,
            userId: transaction.userId,
            amount: transaction.amount,
            status: transaction.status as any,
            gateway: transaction.gateway as any,
            gatewayTransactionId: transaction.gatewayTransactionId ?? null,
            subscriptionId: transaction.subscriptionId ?? null,
            pricingPlanId: transaction.pricingPlanId ?? null,
            paymentMethod: transaction.paymentMethod ?? null,
        } as any;
    }
}