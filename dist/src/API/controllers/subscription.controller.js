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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("../../domain/services/subscription.service");
const create_subscription_dto_1 = require("../../application/DTOs/subscriptions/create-subscription.dto");
const update_subscription_dto_1 = require("../../application/DTOs/subscriptions/update-subscription.dto");
const grant_subscription_dto_1 = require("../../application/DTOs/subscriptions/grant-subscription.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../auth/guards");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async getMyActiveSubscription(req) {
        return this.subscriptionService.findActiveSubscription(req.user.id);
    }
    async getMySubscriptions(req) {
        return this.subscriptionService.getUserSubscriptions(req.user.id);
    }
    async createSubscription(createDto) {
        const params = {
            ...createDto,
            startDate: createDto.startDate ? new Date(createDto.startDate) : undefined,
            endDate: createDto.endDate ? new Date(createDto.endDate) : undefined,
        };
        return this.subscriptionService.createSubscription(params);
    }
    async updateSubscription(id, updateDto) {
        const params = {
            ...updateDto,
            startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
            endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        };
        return this.subscriptionService.update(id, params);
    }
    async toggleAutoRenew(id, body) {
        return this.subscriptionService.toggleAutoRenew(id, body.autoRenew);
    }
    async endInstantSession(id) {
        return this.subscriptionService.endInstantSession(id);
    }
    async updateSessions(id, body) {
        return this.subscriptionService.updateRemainingSessions(id, body.sessions);
    }
    async grantSessions(body) {
        return this.subscriptionService.grantSessionsToUser(body.userId, body.sessions);
    }
    async grantPlan(grantDto) {
        return this.subscriptionService.adminGrantSubscription(grantDto);
    }
    async getActiveUsers() {
        return this.subscriptionService.getUsersWithSubscriptionStatus('ACTIVE');
    }
    async getExpiredUsers() {
        return this.subscriptionService.getUsersWithSubscriptionStatus('EXPIRED');
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active subscription for logged-in user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getMyActiveSubscription", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all my subscriptions history' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getMySubscriptions", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Manually create a subscription (Admin/Internal)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update/Cancel subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Patch)(':id/auto-renew'),
    (0, swagger_1.ApiOperation)({ summary: 'Start or Stop auto-renewal for a subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "toggleAutoRenew", null);
__decorate([
    (0, common_1.Patch)(':id/end-instant-session'),
    (0, swagger_1.ApiOperation)({ summary: 'End an instant session subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "endInstantSession", null);
__decorate([
    (0, common_1.Patch)(':id/sessions'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Manually update remaining sessions (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateSessions", null);
__decorate([
    (0, common_1.Patch)('grant-sessions'),
    (0, common_1.UseGuards)(guards_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN, client_1.AdminType.OPERATIONS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Grant sessions to a user (Super/Operations Admin Only)',
        description: 'Allows granting sessions to any user, even if they dont have a subscription. Creates a subscription if needed. Access restricted to SUPER_ADMIN and OPERATIONS_ADMIN.'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "grantSessions", null);
__decorate([
    (0, common_1.Post)('grant-plan'),
    (0, common_1.UseGuards)(guards_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN, client_1.AdminType.OPERATIONS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Grant a full subscription plan to a user (Super/Operations Admin Only)',
        description: 'Creates an active subscription for the user with the specified plan. Access restricted to SUPER_ADMIN and OPERATIONS_ADMIN.'
    }),
    __param(0, (0, common_1.Body)(new common_2.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grant_subscription_dto_1.GrantSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "grantPlan", null);
__decorate([
    (0, common_1.Get)('users/active'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with active subscriptions (Admin Only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getActiveUsers", null);
__decorate([
    (0, common_1.Get)('users/expired'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with expired subscriptions (Admin Only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getExpiredUsers", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map