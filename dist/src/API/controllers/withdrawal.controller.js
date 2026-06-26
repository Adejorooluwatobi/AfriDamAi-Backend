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
exports.WithdrawalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const withdrawal_request_service_1 = require("../../domain/services/withdrawal-request.service");
const withdrawal_request_entity_1 = require("../../domain/entities/withdrawal-request.entity");
const wallet_service_1 = require("../../domain/services/wallet.service");
const client_1 = require("@prisma/client");
let WithdrawalController = class WithdrawalController {
    constructor(withdrawalRequestService, walletService) {
        this.withdrawalRequestService = withdrawalRequestService;
        this.walletService = walletService;
    }
    async requestWithdrawal(req, amount) {
        const requestedById = req.user.id;
        let requestedByType;
        if (req.user.type === 'admin') {
            throw new common_1.BadRequestException('Admins cannot request personal withdrawals from this endpoint.');
        }
        else if (req.user.type === 'vendor') {
            requestedByType = client_1.WalletOwnerType.VENDOR;
        }
        else if (req.user.type === 'specialist') {
            requestedByType = client_1.WalletOwnerType.SPECIALIST;
        }
        else {
            requestedByType = client_1.WalletOwnerType.USER;
        }
        const wallet = await this.walletService.getWalletByOwner(requestedById, requestedByType);
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance for withdrawal request.');
        }
        const params = {
            walletId: wallet.id,
            amount: amount,
            requestedById: requestedById,
            requestedByType: requestedByType,
        };
        return this.withdrawalRequestService.requestWithdrawal(params);
    }
};
exports.WithdrawalController = WithdrawalController;
__decorate([
    (0, common_1.Post)('request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a withdrawal from the authenticated user/vendor/specialist wallet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Withdrawal request created successfully', type: withdrawal_request_entity_1.WithdrawalRequestEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (e.g., insufficient balance)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WithdrawalController.prototype, "requestWithdrawal", null);
exports.WithdrawalController = WithdrawalController = __decorate([
    (0, swagger_1.ApiTags)('Withdrawals'),
    (0, common_1.Controller)('withdrawals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [withdrawal_request_service_1.WithdrawalRequestService,
        wallet_service_1.WalletService])
], WithdrawalController);
//# sourceMappingURL=withdrawal.controller.js.map