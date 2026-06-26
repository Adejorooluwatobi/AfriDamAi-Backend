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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const create_user_dto_1 = require("../../application/DTOs/users/create-user.dto");
const forgot_password_dto_1 = require("../../application/DTOs/users/forgot-password.dto");
const reset_password_dto_1 = require("../../application/DTOs/users/reset-password.dto");
const create_vendor_dto_1 = require("../../application/DTOs/vendor/create-vendor.dto");
const create_admin_dto_1 = require("../../application/DTOs/admin/create-admin.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const create_specialist_dto_1 = require("../../application/DTOs/specialist/create-specialist.dto");
const verify_registration_dto_1 = require("./dto/verify-registration.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerUser(registerDto) {
        await this.authService.registerUser(registerDto);
        return {
            succeeded: true,
            message: 'A verification code has been sent to your email. Please verify to complete registration.',
        };
    }
    async userLogin(loginDto) {
        const token = await this.authService.loginUser(loginDto.email, loginDto.password);
        return {
            id: token.user?.id || '',
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            isActive: token.user?.isActive || false,
            displayName: `${token.user?.firstName || ''} ${token.user?.lastName || ''}`.trim(),
            role: token.user?.role || 'user',
            plan: token.user?.plan
        };
    }
    async registerSpecialist(registerDto) {
        await this.authService.registerSpecialist(registerDto);
        return {
            succeeded: true,
            message: 'A verification code has been sent to your email. Please verify to complete registration.',
        };
    }
    async specialistLogin(loginDto) {
        const token = await this.authService.loginSpecialist(loginDto.email, loginDto.password);
        return {
            id: token.specialist?.id || '',
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            isActive: token.specialist?.isActive || false,
            displayName: `${token.specialist?.firstName || ''} ${token.specialist?.lastName || ''}`.trim(),
            role: token.specialist?.role || 'specialist',
            type: token.specialist?.type
        };
    }
    async verifyRegistration(verifyDto) {
        const result = await this.authService.completeRegistration(verifyDto.email, verifyDto.code);
        return {
            succeeded: true,
            message: 'Email verified and account created successfully.',
            resultData: result
        };
    }
    async forgotPassword(forgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return {
            succeeded: true,
            message: 'If an account exists with this email, a reset link has been sent.',
        };
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
        return {
            succeeded: true,
            message: 'Password updated successfully. You can now login.'
        };
    }
    async deleteAccount(req) {
        const userId = req.user?.id || req.user?.sub;
        await this.authService.deleteAccount(userId);
        return {
            succeeded: true,
            message: 'Account deletion protocol initiated.'
        };
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }
    async registerAdmin(registerDto) {
        await this.authService.registerAdmin(registerDto);
        return 'Admin registered successfully';
    }
    async adminLogin(loginDto) {
        const token = await this.authService.loginAdmin(loginDto.email, loginDto.password);
        return {
            id: token.admin?.id || '',
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            isActive: token.admin?.isActive || false,
            displayName: token.admin?.username || '',
            role: token.admin?.role || 'admin',
            type: token.admin?.type
        };
    }
    async registerVendor(registerDto) {
        await this.authService.registerVendor(registerDto);
        return {
            succeeded: true,
            message: 'A verification code has been sent to your email. Please verify to complete registration.',
        };
    }
    async vendorLogin(loginDto) {
        const token = await this.authService.loginVendor(loginDto.email, loginDto.password);
        return {
            id: token.vendor?.id || '',
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            isActive: token.vendor?.isActive || false,
            displayName: token.vendor?.companyName || '',
            role: token.vendor?.role || 'vendor'
        };
    }
    async logout(req) {
        const userId = req.user?.id || req.user?.sub;
        const role = req.user?.role;
        if (!userId || !role) {
            throw new common_1.BadRequestException('User ID or role not found in token.');
        }
        await this.authService.logout(userId, role);
        return {
            succeeded: true,
            message: 'Successfully logged out.'
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('user/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new clinical user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Verification code sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('user/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Secure Login' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.UserLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userLogin", null);
__decorate([
    (0, common_1.Post)('specialist/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new specialist' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Verification code sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialist_dto_1.CreateSpecialistDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerSpecialist", null);
__decorate([
    (0, common_1.Post)('specialist/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Secure Login' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.SpecialistLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "specialistLogin", null);
__decorate([
    (0, common_1.Post)('register/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email and complete registration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified and account created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_registration_dto_1.VerifyRegistrationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyRegistration", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with clinical token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete account - Dignity Zone' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh clinical session' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('admin/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin registered successfully', type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('vendor/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new vendor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Verification code sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vendor_dto_1.CreateVendorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerVendor", null);
__decorate([
    (0, common_1.Post)('vendor/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.VendorLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "vendorLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user, admin, or vendor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map