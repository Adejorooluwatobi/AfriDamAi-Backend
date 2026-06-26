"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const wallet_service_1 = require("../../domain/services/wallet.service");
const wallet_transaction_service_1 = require("../../domain/services/wallet-transaction.service");
const client_1 = require("@prisma/client");
const wallet_entity_1 = require("../../domain/entities/wallet.entity");
const wallet_transaction_entity_1 = require("../../domain/entities/wallet-transaction.entity");
const admin_service_1 = require("../../domain/services/admin.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const admin_role_guard_1 = require("../auth/guards/admin-role.guard");
let WalletController = class WalletController {
    constructor(walletService, walletTransactionService, adminService) {
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.adminService = adminService;
    }
    async getMyWallet(req) {
        const ownerId = req.user.id;
        let ownerType;
        if (req.user.role === 'admin') {
            throw new common_1.BadRequestException('Admins do not have a personal wallet. Please use the organization wallet.');
        }
        else if (req.user.type === 'vendor') {
            ownerType = client_1.WalletOwnerType.VENDOR;
        }
        else if (req.user.type === 'specialist') {
            ownerType = client_1.WalletOwnerType.SPECIALIST;
        }
        else if (req.user.type === 'user') {
            throw new common_1.BadRequestException('Users do not have a personal wallet in this context.');
        }
        else {
            throw new common_1.BadRequestException('Invalid wallet owner type.');
        }
        try {
            return await this.walletService.getWalletByOwner(ownerId, ownerType);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return this.walletService.createWallet({
                    ownerId,
                    ownerType,
                    initialBalance: 0,
                });
            }
            throw error;
        }
    }
    async getMyWalletTransactions(req) {
        const ownerId = req.user.id;
        let ownerType;
        if (req.user.role === 'admin') {
            throw new common_1.BadRequestException('Admins do not have a personal wallet history.');
        }
        else if (req.user.type === 'vendor') {
            ownerType = client_1.WalletOwnerType.VENDOR;
        }
        else if (req.user.type === 'specialist') {
            ownerType = client_1.WalletOwnerType.SPECIALIST;
        }
        else if (req.user.type === 'user') {
            throw new common_1.BadRequestException('Users do not have a personal wallet history.');
        }
        else {
            throw new common_1.BadRequestException('Invalid wallet owner type.');
        }
        const wallet = await this.walletService.getWalletByOwner(ownerId, ownerType);
        return this.walletTransactionService.getWalletTransactionsByWalletId(wallet.id);
    }
    async getOrganizationWallet() {
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        if (superAdmins.length === 0) {
            throw new common_1.InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
        }
        const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
        try {
            return await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, client_1.WalletOwnerType.ORGANIZATION);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return this.walletService.createWallet({
                    ownerId: ORGANIZATION_ADMIN_ID,
                    ownerType: client_1.WalletOwnerType.ORGANIZATION,
                    initialBalance: 0,
                });
            }
            throw error;
        }
    }
    async getOrganizationWalletTransactions() {
        const superAdmins = await this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN);
        if (superAdmins.length === 0) {
            throw new common_1.InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
        }
        const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
        const organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, client_1.WalletOwnerType.ORGANIZATION);
        return this.walletTransactionService.getWalletTransactionsByWalletId(organizationWallet.id);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the authenticated user/vendor/specialist wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet retrieved successfully', type: wallet_entity_1.Wallet }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getMyWallet", null);
__decorate([
    (0, common_1.Get)('me/transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history for the authenticated user/vendor/specialist wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet transactions retrieved successfully', type: [wallet_transaction_entity_1.WalletTransactionEntity] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getMyWalletTransactions", null);
__decorate([
    (0, common_1.Get)('organization'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN, client_1.AdminType.FINANCE_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get the organization wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization Wallet retrieved successfully', type: wallet_entity_1.Wallet }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organization Wallet not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getOrganizationWallet", null);
__decorate([
    (0, common_1.Get)('organization/transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN, client_1.AdminType.FINANCE_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get transaction history for the organization wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization Wallet transactions retrieved successfully', type: [wallet_transaction_entity_1.WalletTransactionEntity] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organization Wallet not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getOrganizationWalletTransactions", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallets'),
    (0, common_1.Controller)('wallets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wallet_service_1.WalletService,
        wallet_transaction_service_1.WalletTransactionService,
        admin_service_1.AdminService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map