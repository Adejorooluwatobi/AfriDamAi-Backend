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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../../domain/services/admin.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_admin_dto_1 = require("../../application/DTOs/admin/create-admin.dto");
const admin_mapper_1 = require("../../infrastructure/mappers/admin.mapper");
const response_dto_1 = require("../../application/DTOs/response.dto");
const guards_1 = require("../auth/guards");
const update_account_status_dto_1 = require("../../application/DTOs/update-account-status.dto");
const update_suspension_status_dto_1 = require("../../application/DTOs/update-suspension-status.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async create(createAdminDto) {
        const admin = await this.adminService.createAdmin(createAdminDto);
        if (!admin) {
            throw new common_1.InternalServerErrorException('Admin creation failed');
        }
        const secureAdmin = admin_mapper_1.AdminMapper.toSecureResponse(admin);
        return {
            succeeded: true,
            message: 'Admin created successfully',
            resultData: secureAdmin
        };
    }
    async findAll() {
        const admins = await this.adminService.findAllAdmin();
        const secureAdmins = admins.map(admin => admin_mapper_1.AdminMapper.toSecureResponse(admin));
        return {
            succeeded: true,
            message: 'Admins retrieved successfully',
            resultData: secureAdmins
        };
    }
    async getMe(req) {
        const id = req.user?.id || req.user?.admin?.id || req.admin?.id;
        if (!id) {
            throw new common_1.UnauthorizedException('Admin ID missing from session');
        }
        const admin = await this.adminService.findOneAdmin(id);
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const secureAdmin = admin_mapper_1.AdminMapper.toSecureResponse(admin);
        return {
            succeeded: true,
            message: 'Admin info retrieved successfully',
            resultData: secureAdmin
        };
    }
    async findOne(id) {
        const admin = await this.adminService.findOneAdmin(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with id ${id} not found`);
        }
        const secureAdmin = admin_mapper_1.AdminMapper.toSecureResponse(admin);
        return {
            succeeded: true,
            message: 'Admin retrieved successfully',
            resultData: secureAdmin
        };
    }
    async update(id, updateAdminDto) {
        const admin = await this.adminService.updateAdmin(id, updateAdminDto);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with id ${id} not found`);
        }
        const secureAdmin = admin_mapper_1.AdminMapper.toSecureResponse(admin);
        return {
            succeeded: true,
            message: 'Admin updated successfully',
            resultData: secureAdmin
        };
    }
    async delete(id) {
        await this.adminService.deleteAdmin(id);
        return {
            succeeded: true,
            message: 'Admin deleted successfully'
        };
    }
    async updateActiveStatus(id, statusDto) {
        const admin = await this.adminService.updateAdminActiveStatus(id, statusDto.isActive);
        return {
            succeeded: true,
            message: `Admin account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
            resultData: admin_mapper_1.AdminMapper.toSecureResponse(admin)
        };
    }
    async updateSuspensionStatus(id, statusDto) {
        const admin = await this.adminService.updateAdminSuspensionStatus(id, statusDto.isSuspended);
        return {
            succeeded: true,
            message: `Admin account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
            resultData: admin_mapper_1.AdminMapper.toSecureResponse(admin)
        };
    }
    async getWebhookLogs() {
        const logs = await this.adminService.getWebhookLogs();
        return {
            succeeded: true,
            message: 'Webhook logs retrieved successfully',
            resultData: logs
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all admins' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureAdminResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current admin info with profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve an admin by ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.SuperAdminGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an admin by ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an admin by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/active-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable/Disable admin account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateActiveStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/suspension-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend/Unsuspend admin account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureAdminResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_suspension_status_dto_1.UpdateSuspensionStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSuspensionStatus", null);
__decorate([
    (0, common_1.Get)('logs/webhooks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve Webhook logs for troubleshooting' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWebhookLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_admin_dto_1.CreateAdminDto),
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map