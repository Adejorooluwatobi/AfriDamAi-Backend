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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../../domain/services/user.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_user_dto_1 = require("../../application/DTOs/users/create-user.dto");
const update_user_dto_1 = require("../../application/DTOs/users/update-user.dto");
const cart_service_1 = require("../../domain/services/cart.service");
const user_mapper_1 = require("../../infrastructure/mappers/user.mapper");
const guards_1 = require("../auth/guards");
const response_dto_1 = require("../../application/DTOs/response.dto");
const update_account_status_dto_1 = require("../../application/DTOs/update-account-status.dto");
const update_suspension_status_dto_1 = require("../../application/DTOs/update-suspension-status.dto");
let UserController = class UserController {
    constructor(userService, cartService) {
        this.userService = userService;
        this.cartService = cartService;
    }
    async create(createUserDto) {
        const user = await this.userService.createUser(createUserDto);
        await this.cartService.createCart(user.id);
        if (!user) {
            throw new common_1.InternalServerErrorException('Clinical user creation failed');
        }
        const secureUser = user_mapper_1.UserMapper.toSecureUserResponseDto(user);
        return {
            succeeded: true,
            message: 'User created successfully',
            resultData: secureUser
        };
    }
    async uploadAvatar(req, file) {
        const userInfo = this.extractUserId(req.user);
        if (!file) {
            throw new common_1.BadRequestException('No file detected in request');
        }
        const user = await this.userService.updateUserAvatar(userInfo.id, file);
        return {
            succeeded: true,
            message: 'Avatar updated successfully',
            url: user.profile?.avatarUrl
        };
    }
    async findAll() {
        const users = await this.userService.findAllUser();
        const secureUsers = users.map(user => user_mapper_1.UserMapper.toSecureUserResponseDto(user));
        return {
            succeeded: true,
            message: 'Users retrieved successfully',
            resultData: secureUsers
        };
    }
    async getMe(req) {
        const userInfo = this.extractUserId(req.user);
        const user = await this.userService.findOneUser(userInfo.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const secureUser = user_mapper_1.UserMapper.toSecureUserResponseDto(user);
        return {
            succeeded: true,
            message: 'User info retrieved successfully',
            resultData: secureUser
        };
    }
    extractUserId(user) {
        const id = user.user?.id || user.id || user.sub;
        if (id)
            return { id, type: 'user' };
        throw new common_1.NotFoundException('Clinical ID missing from session');
    }
    async update(id, updateUserDto) {
        const user = await this.userService.updateUser(id, updateUserDto);
        if (!user) {
            throw new common_1.NotFoundException(`Clinical account ${id} not found`);
        }
        const secureUser = user_mapper_1.UserMapper.toSecureUserResponseDto(user);
        return {
            succeeded: true,
            message: 'Profile sync successful',
            resultData: secureUser
        };
    }
    async findUser(id) {
        const user = await this.userService.findOneUser(id);
        if (!user)
            throw new common_1.NotFoundException(`Account not found`);
        return {
            succeeded: true,
            resultData: user_mapper_1.UserMapper.toSecureUserResponseDto(user)
        };
    }
    async delete(id) {
        await this.userService.deleteUser(id);
        return { succeeded: true, message: 'Account purged successfully' };
    }
    async updateStatus(id, statusDto) {
        const user = await this.userService.updateUserActiveStatus(id, statusDto.isActive);
        return {
            succeeded: true,
            message: `Account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
            resultData: user_mapper_1.UserMapper.toSecureUserResponseDto(user)
        };
    }
    async updateSuspensionStatus(id, statusDto) {
        const user = await this.userService.updateUserSuspensionStatus(id, statusDto.isSuspended);
        return {
            succeeded: true,
            message: `Account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
            resultData: user_mapper_1.UserMapper.toSecureUserResponseDto(user)
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clinical user' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_dto_1.SecureUserResponseDto }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload melanin-profile picture' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all users' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: [response_dto_1.SecureUserResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current clinical info with profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update clinical profile and onboarding status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user (Admin Only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/active-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable/Disable user account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureUserResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/suspension-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend/Unsuspend user account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureUserResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_suspension_status_dto_1.UpdateSuspensionStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSuspensionStatus", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_user_dto_1.CreateUserDto),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        cart_service_1.CartService])
], UserController);
//# sourceMappingURL=user.controller.js.map