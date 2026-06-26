"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequestMapper = void 0;
const withdrawal_request_entity_1 = require("../../domain/entities/withdrawal-request.entity");
const wallet_mapper_1 = require("./wallet.mapper");
class WithdrawalRequestMapper {
    static toDomain(prismaRequest) {
        const request = new withdrawal_request_entity_1.WithdrawalRequestEntity({
            id: prismaRequest.id,
            walletId: prismaRequest.walletId,
            amount: prismaRequest.amount,
            status: prismaRequest.status,
            requestedById: prismaRequest.requestedById,
            requestedByType: prismaRequest.requestedByType,
            approvedById: prismaRequest.approvedById,
            requestedAt: prismaRequest.requestedAt,
            approvedAt: prismaRequest.approvedAt,
            paidAt: prismaRequest.paidAt,
            adminNotes: prismaRequest.adminNotes,
        });
        if (prismaRequest.wallet) {
            request.wallet = wallet_mapper_1.WalletMapper.toDomain(prismaRequest.wallet);
        }
        return request;
    }
    static toPersistence(request) {
        return {
            id: request.id,
            walletId: request.walletId,
            amount: request.amount,
            status: request.status,
            requestedById: request.requestedById,
            requestedByType: request.requestedByType,
            approvedById: request.approvedById,
            requestedAt: request.requestedAt,
            approvedAt: request.approvedAt,
            paidAt: request.paidAt,
            adminNotes: request.adminNotes,
        };
    }
}
exports.WithdrawalRequestMapper = WithdrawalRequestMapper;
//# sourceMappingURL=withdrawal-request.mapper.js.map