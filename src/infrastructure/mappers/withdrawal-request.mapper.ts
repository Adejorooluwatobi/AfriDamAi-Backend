import { WithdrawalRequestEntity } from "src/domain/entities/withdrawal-request.entity";
import { WithdrawalRequest as PrismaWithdrawalRequest } from "@prisma/client";
import { WalletMapper } from "./wallet.mapper";

export class WithdrawalRequestMapper {
  static toDomain(prismaRequest: PrismaWithdrawalRequest & { wallet?: any }): WithdrawalRequestEntity {
    const request = new WithdrawalRequestEntity({
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
      request.wallet = WalletMapper.toDomain(prismaRequest.wallet);
    }

    return request;
  }

  static toPersistence(request: Partial<WithdrawalRequestEntity>): Partial<PrismaWithdrawalRequest> {
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
