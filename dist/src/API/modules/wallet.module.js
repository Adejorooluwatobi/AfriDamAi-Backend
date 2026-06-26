"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const wallet_service_1 = require("../../domain/services/wallet.service");
const wallet_transaction_service_1 = require("../../domain/services/wallet-transaction.service");
const withdrawal_request_service_1 = require("../../domain/services/withdrawal-request.service");
const prisma_wallet_repository_1 = require("../../infrastructure/persistence/prisma/prisma-wallet.repository");
const prisma_wallet_transaction_repository_1 = require("../../infrastructure/persistence/prisma/prisma-wallet-transaction.repository");
const prisma_withdrawal_request_repository_1 = require("../../infrastructure/persistence/prisma/prisma-withdrawal-request.repository");
const notification_module_1 = require("./notification.module");
const admin_module_1 = require("./admin.module");
const user_module_1 = require("./user.module");
const vendor_module_1 = require("./vendor.module");
const specialist_module_1 = require("./specialist.module");
const wallet_controller_1 = require("../controllers/wallet.controller");
const withdrawal_controller_1 = require("../controllers/withdrawal.controller");
const admin_withdrawal_controller_1 = require("../controllers/admin-withdrawal.controller");
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            notification_module_1.NotificationModule,
            admin_module_1.AdminModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => vendor_module_1.VendorModule),
            (0, common_1.forwardRef)(() => specialist_module_1.SpecialistModule),
        ],
        controllers: [
            wallet_controller_1.WalletController,
            withdrawal_controller_1.WithdrawalController,
            admin_withdrawal_controller_1.AdminWithdrawalController,
        ],
        providers: [
            wallet_service_1.WalletService,
            wallet_transaction_service_1.WalletTransactionService,
            withdrawal_request_service_1.WithdrawalRequestService,
            {
                provide: 'IWalletRepository',
                useClass: prisma_wallet_repository_1.PrismaWalletRepository,
            },
            {
                provide: 'IWalletTransactionRepository',
                useClass: prisma_wallet_transaction_repository_1.PrismaWalletTransactionRepository,
            },
            {
                provide: 'IWithdrawalRequestRepository',
                useClass: prisma_withdrawal_request_repository_1.PrismaWithdrawalRequestRepository,
            },
        ],
        exports: [
            wallet_service_1.WalletService,
            wallet_transaction_service_1.WalletTransactionService,
            withdrawal_request_service_1.WithdrawalRequestService,
        ],
    })
], WalletModule);
//# sourceMappingURL=wallet.module.js.map