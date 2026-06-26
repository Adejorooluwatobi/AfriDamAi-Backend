import { OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { WalletService } from './wallet.service';
export declare class SeedService implements OnModuleInit {
    private readonly adminService;
    private readonly walletService;
    private readonly logger;
    constructor(adminService: AdminService, walletService: WalletService);
    onModuleInit(): Promise<void>;
    private seedOrganizationAdminAndWallet;
}
