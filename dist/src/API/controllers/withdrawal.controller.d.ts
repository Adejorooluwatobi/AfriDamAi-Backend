import { WithdrawalRequestService } from 'src/domain/services/withdrawal-request.service';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
import { WalletService } from 'src/domain/services/wallet.service';
export declare class WithdrawalController {
    private readonly withdrawalRequestService;
    private readonly walletService;
    constructor(withdrawalRequestService: WithdrawalRequestService, walletService: WalletService);
    requestWithdrawal(req: any, amount: number): Promise<WithdrawalRequestEntity>;
}
