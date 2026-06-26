import { WalletService } from 'src/domain/services/wallet.service';
import { WalletTransactionService } from 'src/domain/services/wallet-transaction.service';
import { Wallet } from 'src/domain/entities/wallet.entity';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { AdminService } from 'src/domain/services/admin.service';
export declare class WalletController {
    private readonly walletService;
    private readonly walletTransactionService;
    private readonly adminService;
    constructor(walletService: WalletService, walletTransactionService: WalletTransactionService, adminService: AdminService);
    getMyWallet(req: any): Promise<Wallet>;
    getMyWalletTransactions(req: any): Promise<WalletTransactionEntity[]>;
    getOrganizationWallet(): Promise<Wallet>;
    getOrganizationWalletTransactions(): Promise<WalletTransactionEntity[]>;
}
