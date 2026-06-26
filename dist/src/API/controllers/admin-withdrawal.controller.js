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
exports.AdminWithdrawalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_role_guard_1 = require("../auth/guards/admin-role.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const withdrawal_request_service_1 = require("../../domain/services/withdrawal-request.service");
const withdrawal_request_entity_1 = require("../../domain/entities/withdrawal-request.entity");
let AdminWithdrawalController = class AdminWithdrawalController {
    constructor(withdrawalRequestService) {
        this.withdrawalRequestService = withdrawalRequestService;
    }
    async getPendingWithdrawalRequests() {
        return this.withdrawalRequestService.getPendingWithdrawalRequests();
    }
    async getWithdrawalRequestById(id) {
        return this.withdrawalRequestService.getWithdrawalRequestById(id);
    }
    async approveWithdrawal(requestId, req, adminNotes) {
        return this.withdrawalRequestService.approveWithdrawal(requestId, req.user.id, adminNotes);
    }
    async markWithdrawalAsPaid(requestId, req, adminNotes) {
        return this.withdrawalRequestService.markWithdrawalAsPaid(requestId, req.user.id, adminNotes);
    }
    async rejectWithdrawal(requestId, req, reason) {
        if (!reason) {
            throw new common_1.BadRequestException('Rejection reason is required.');
        }
        return this.withdrawalRequestService.rejectWithdrawal(requestId, req.user.id, reason);
    }
};
exports.AdminWithdrawalController = AdminWithdrawalController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get all pending withdrawal requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending withdrawal requests retrieved successfully', type: [withdrawal_request_entity_1.WithdrawalRequestEntity] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWithdrawalController.prototype, "getPendingWithdrawalRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Get a withdrawal request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal request retrieved successfully', type: withdrawal_request_entity_1.WithdrawalRequestEntity }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Withdrawal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWithdrawalController.prototype, "getWithdrawalRequestById", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Approve a pending withdrawal request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal request approved successfully', type: withdrawal_request_entity_1.WithdrawalRequestEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (e.g., request not pending, insufficient funds)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Withdrawal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('adminNotes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminWithdrawalController.prototype, "approveWithdrawal", null);
__decorate([
    (0, common_1.Put)(':id/mark-paid'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Mark an approved withdrawal request as paid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal request marked as paid successfully', type: withdrawal_request_entity_1.WithdrawalRequestEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (e.g., request not approved)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Withdrawal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('adminNotes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminWithdrawalController.prototype, "markWithdrawalAsPaid", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Reject a pending withdrawal request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal request rejected successfully', type: withdrawal_request_entity_1.WithdrawalRequestEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (e.g., request not pending)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Withdrawal request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminWithdrawalController.prototype, "rejectWithdrawal", null);
exports.AdminWithdrawalController = AdminWithdrawalController = __decorate([
    (0, swagger_1.ApiTags)('Admin Withdrawals'),
    (0, common_1.Controller)('admin/withdrawals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN, client_1.AdminType.FINANCE_ADMIN),
    __metadata("design:paramtypes", [withdrawal_request_service_1.WithdrawalRequestService])
], AdminWithdrawalController);
//# sourceMappingURL=admin-withdrawal.controller.js.map