"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMapper = void 0;
const transaction_entity_1 = require("../../domain/entities/transaction.entity");
class TransactionMapper {
    static toDomain(prismaTransaction) {
        return new transaction_entity_1.TransactionEntity({
            id: prismaTransaction.id,
            orderId: prismaTransaction.orderId ?? undefined,
            appointmentId: prismaTransaction.appointmentId ?? undefined,
            userId: prismaTransaction.userId,
            amount: prismaTransaction.amount,
            status: prismaTransaction.status,
            subscriptionId: prismaTransaction.subscriptionId ?? undefined,
            pricingPlanId: prismaTransaction.pricingPlanId ?? undefined,
            gateway: prismaTransaction.gateway,
            gatewayTransactionId: prismaTransaction.gatewayTransactionId ?? undefined,
            paymentMethod: prismaTransaction.paymentMethod ?? undefined,
            createdAt: prismaTransaction.createdAt,
            updatedAt: prismaTransaction.updatedAt,
        });
    }
    static toPrisma(transaction) {
        return {
            id: transaction.id,
            orderId: transaction.orderId ?? null,
            appointmentId: transaction.appointmentId ?? null,
            userId: transaction.userId,
            amount: transaction.amount,
            status: transaction.status,
            gateway: transaction.gateway,
            gatewayTransactionId: transaction.gatewayTransactionId ?? null,
            subscriptionId: transaction.subscriptionId ?? null,
            pricingPlanId: transaction.pricingPlanId ?? null,
            paymentMethod: transaction.paymentMethod ?? null,
        };
    }
}
exports.TransactionMapper = TransactionMapper;
//# sourceMappingURL=transaction.mapper.js.map