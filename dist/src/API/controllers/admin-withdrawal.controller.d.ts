import { WithdrawalRequestService } from 'src/domain/services/withdrawal-request.service';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
export declare class AdminWithdrawalController {
    private readonly withdrawalRequestService;
    constructor(withdrawalRequestService: WithdrawalRequestService);
    getPendingWithdrawalRequests(): Promise<WithdrawalRequestEntity[]>;
    getWithdrawalRequestById(id: string): Promise<WithdrawalRequestEntity>;
    approveWithdrawal(requestId: string, req: any, adminNotes?: string): Promise<WithdrawalRequestEntity>;
    markWithdrawalAsPaid(requestId: string, req: any, adminNotes?: string): Promise<WithdrawalRequestEntity>;
    rejectWithdrawal(requestId: string, req: any, reason: string): Promise<WithdrawalRequestEntity>;
}
