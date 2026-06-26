import { WithdrawalRequestEntity } from "src/domain/entities/withdrawal-request.entity";
import { WithdrawalRequest as PrismaWithdrawalRequest } from "@prisma/client";
export declare class WithdrawalRequestMapper {
    static toDomain(prismaRequest: PrismaWithdrawalRequest & {
        wallet?: any;
    }): WithdrawalRequestEntity;
    static toPersistence(request: Partial<WithdrawalRequestEntity>): Partial<PrismaWithdrawalRequest>;
}
