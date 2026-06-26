"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
const wallet_entity_1 = require("../../domain/entities/wallet.entity");
const wallet_transaction_mapper_1 = require("./wallet-transaction.mapper");
const withdrawal_request_mapper_1 = require("./withdrawal-request.mapper");
class WalletMapper {
    static toDomain(prismaWallet) {
        const wallet = new wallet_entity_1.Wallet({
            id: prismaWallet.id,
            ownerId: prismaWallet.ownerId,
            ownerType: prismaWallet.ownerType,
            balance: prismaWallet.balance,
            createdAt: prismaWallet.createdAt,
            updatedAt: prismaWallet.updatedAt,
        });
        if (prismaWallet.transactions) {
            wallet.transactions = prismaWallet.transactions.map(wallet_transaction_mapper_1.WalletTransactionMapper.toDomain);
        }
        if (prismaWallet.withdrawalRequests) {
            wallet.withdrawalRequests = prismaWallet.withdrawalRequests.map(withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain);
        }
        return wallet;
    }
    static toPersistence(wallet) {
        return {
            id: wallet.id,
            ownerId: wallet.ownerId,
            ownerType: wallet.ownerType,
            balance: wallet.balance,
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt,
        };
    }
    static toDomainArray(prismaWallets) {
        return prismaWallets.map(prismaWallet => WalletMapper.toDomain(prismaWallet));
    }
}
exports.WalletMapper = WalletMapper;
//# sourceMappingURL=wallet.mapper.js.map