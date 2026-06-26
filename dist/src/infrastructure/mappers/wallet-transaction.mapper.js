"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionMapper = void 0;
const wallet_transaction_entity_1 = require("../../domain/entities/wallet-transaction.entity");
const wallet_mapper_1 = require("./wallet.mapper");
class WalletTransactionMapper {
    static toDomain(prismaTransaction) {
        const transaction = new wallet_transaction_entity_1.WalletTransactionEntity({
            id: prismaTransaction.id,
            walletId: prismaTransaction.walletId,
            type: prismaTransaction.type,
            amount: prismaTransaction.amount,
            description: prismaTransaction.description,
            relatedEntityId: prismaTransaction.relatedEntityId,
            relatedEntityType: prismaTransaction.relatedEntityType,
            createdAt: prismaTransaction.createdAt,
            updatedAt: prismaTransaction.updatedAt,
        });
        if (prismaTransaction.wallet) {
            transaction.wallet = wallet_mapper_1.WalletMapper.toDomain(prismaTransaction.wallet);
        }
        return transaction;
    }
    static toPersistence(transaction) {
        return {
            id: transaction.id,
            walletId: transaction.walletId,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            relatedEntityId: transaction.relatedEntityId,
            relatedEntityType: transaction.relatedEntityType,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
}
exports.WalletTransactionMapper = WalletTransactionMapper;
//# sourceMappingURL=wallet-transaction.mapper.js.map