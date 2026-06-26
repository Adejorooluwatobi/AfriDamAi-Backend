"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const admin_service_1 = require("../../domain/services/admin.service");
const user_service_1 = require("../../domain/services/user.service");
const vendor_service_1 = require("../../domain/services/vendor.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
const vendor_entity_1 = require("../../domain/entities/vendor.entity");
const specialist_service_1 = require("../../domain/services/specialist.service");
const prisma_email_verification_repository_1 = require("../../infrastructure/persistence/prisma/prisma-email-verification.repository");
const admin_notification_service_1 = require("../../domain/services/admin-notification.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(configService, jwtService, userService, adminService, vendorService, specialistService, mailService, emailVerificationRepo, adminNotificationService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.adminService = adminService;
        this.vendorService = vendorService;
        this.specialistService = specialistService;
        this.mailService = mailService;
        this.emailVerificationRepo = emailVerificationRepo;
        this.adminNotificationService = adminNotificationService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.jwtSecret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async registerUser(registerDto) {
        await this.initiateRegistration(registerDto.email, registerDto, 'USER');
    }
    async registerVendor(registerDto) {
        await this.initiateRegistration(registerDto.email, registerDto, 'VENDOR');
    }
    async registerSpecialist(registerDto) {
        await this.initiateRegistration(registerDto.email, registerDto, 'SPECIALIST');
    }
    async initiateRegistration(email, payload, role) {
        let existing = null;
        if (role === 'USER')
            existing = await this.userService.findByEmail(email);
        else if (role === 'VENDOR')
            existing = await this.vendorService.findByEmail(email);
        else if (role === 'SPECIALIST')
            existing = await this.specialistService.findByEmail(email).catch(() => null);
        if (existing) {
            throw new common_1.ConflictException(`Account with email ${email} already exists`);
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.emailVerificationRepo.upsert(email, {
            email,
            code,
            payload,
            role,
            expiresAt,
        });
        await this.mailService.sendVerificationCodeEmail(email, code);
        this.logger.log(`Registration verification code sent to ${email} for role ${role}`);
    }
    async completeRegistration(email, code) {
        const verification = await this.emailVerificationRepo.findByEmail(email);
        if (!verification) {
            throw new common_1.BadRequestException('No pending registration found for this email');
        }
        if (verification.code !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (new Date() > verification.expiresAt) {
            throw new common_1.BadRequestException('Verification code has expired');
        }
        const payload = verification.payload;
        let registeredUser = null;
        if (verification.role === 'USER') {
            registeredUser = await this.userService.createUser({
                email: payload.email,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNo: payload.phoneNo,
                sex: payload.sex,
                nationality: payload.nationality,
                isActive: true,
            });
            this.mailService.sendWelcomeEmail(payload.email, payload.firstName, 'User');
        }
        else if (verification.role === 'VENDOR') {
            registeredUser = await this.vendorService.createVendor({
                email: payload.email,
                password: payload.password,
                companyName: payload.companyName,
                rcNumber: payload.rcNumber,
                businessAddress: payload.businessAddress,
                phoneNumber: payload.phoneNumber,
                documentsUrl: payload.documentsUrl,
                status: vendor_entity_1.VendorStatus.PENDING,
                isActive: true,
            });
            this.mailService.sendWelcomeEmail(payload.email, payload.companyName, 'Vendor');
        }
        else if (verification.role === 'SPECIALIST') {
            registeredUser = await this.specialistService.createSpecialist({
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                phoneNo: payload.phoneNo,
                sex: payload.sex,
                documents: payload.documents || [],
                type: payload.type,
            });
            this.mailService.sendWelcomeEmail(payload.email, payload.firstName, 'Specialist');
        }
        await this.adminNotificationService.notify('ACCOUNT', 'New Account Registered', `<p>A new <strong>${verification.role}</strong> account has been created and verified.</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Name:</strong> ${payload.firstName || payload.companyName || 'N/A'}</p>`);
        await this.emailVerificationRepo.delete(email);
        const roleLower = verification.role.toLowerCase();
        const tokens = await this.getTokens(registeredUser.id, registeredUser.email, roleLower);
        await this.updateRefreshToken(registeredUser.id, tokens.refresh_token, roleLower);
        return {
            ...tokens,
            [roleLower]: {
                ...registeredUser,
                role: verification.role,
            },
        };
    }
    async loginUser(email, password) {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (!user.password) {
                throw new common_1.NotFoundException('User has no password set');
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new common_1.NotFoundException('Invalid password');
            }
            if (user.isSuspended) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            const tokens = await this.getTokens(user.id, user.email, 'user');
            await this.updateRefreshToken(user.id, tokens.refresh_token, 'user');
            await this.userService.updateUser(user.id, {
                lastLoginAt: new Date(),
                isActive: true,
            });
            return {
                ...tokens,
                user: {
                    id: user.id,
                    isAdmin: false,
                    isActive: true,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: 'user',
                    onboardingCompleted: user.onboardingCompleted,
                    plan: user.plan || {
                        id: 'default-free',
                        name: 'Free Tier',
                        type: 'FREE',
                        price: 0,
                        description: ['Basic access'],
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                },
            };
        }
        catch (error) {
            this.logger.error('User login error', error);
            throw error;
        }
    }
    async loginSpecialist(email, password) {
        try {
            const specialist = await this.specialistService.findByEmail(email);
            if (!specialist) {
                throw new common_1.NotFoundException('Specialist not found');
            }
            const passwordMatch = await bcrypt.compare(password, specialist.password);
            if (!passwordMatch) {
                throw new common_1.NotFoundException('Invalid password');
            }
            if (specialist.isSuspended) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            const tokens = await this.getTokens(specialist.id, specialist.email, 'specialist');
            await this.updateRefreshToken(specialist.id, tokens.refresh_token, 'specialist');
            await this.specialistService.updateSpecialist(specialist.id, {
                lastLoginAt: new Date(),
                isActive: true,
            });
            return {
                ...tokens,
                specialist: {
                    id: specialist.id,
                    isSpecialist: true,
                    isActive: true,
                    firstName: specialist.firstName,
                    lastName: specialist.lastName,
                    role: 'specialist',
                    type: specialist.type
                },
            };
        }
        catch (error) {
            this.logger.error('Specialist login error', error);
            throw error;
        }
    }
    async getTokens(userId, email, role, type) {
        const payload = { sub: userId, id: userId, email, role, type };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.jwtSecret,
                expiresIn: '1h',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.jwtSecret,
                expiresIn: '7d',
            }),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken, role) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        if (role === 'user') {
            await this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
        }
        else if (role === 'admin') {
            await this.adminService.updateAdmin(userId, { refreshToken: hashedRefreshToken });
        }
        else if (role === 'vendor') {
            await this.vendorService.updateVendor(userId, { refreshToken: hashedRefreshToken });
        }
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtSecret,
            });
            const userId = payload.sub || payload.id;
            const role = payload.role;
            let user;
            if (role === 'user') {
                user = await this.userService.findOneUser(userId);
            }
            else if (role === 'admin') {
                user = await this.adminService.findOneAdmin(userId);
            }
            else if (role === 'vendor') {
                user = await this.vendorService.findOneVendor(userId);
            }
            if (!user || !user.refreshToken) {
                throw new common_1.UnauthorizedException('Access Denied');
            }
            const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!refreshTokenMatches) {
                throw new common_1.UnauthorizedException('Access Denied');
            }
            const tokens = await this.getTokens(user.id, user.email, role);
            await this.updateRefreshToken(user.id, tokens.refresh_token, role);
            return tokens;
        }
        catch (_e) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
    }
    async registerAdmin(registerDto) {
        await this.adminService.createAdmin({
            email: registerDto.email,
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phoneNo: registerDto.phoneNo,
            type: registerDto.type,
            isActive: true,
            username: registerDto.username || registerDto.email.split('@')[0],
        });
        await this.adminNotificationService.notify('ACCOUNT', 'New Admin Created', `<p>A new <strong>Admin</strong> account has been created.</p>
         <p><strong>Email:</strong> ${registerDto.email}</p>
         <p><strong>Type:</strong> ${registerDto.type}</p>
         <p><strong>Name:</strong> ${registerDto.firstName} ${registerDto.lastName}</p>`);
    }
    async loginAdmin(_email, _password) {
        try {
            const admin = await this.adminService.findByEmail(_email);
            if (!admin) {
                throw new common_1.NotFoundException('Admin not found');
            }
            if (!admin.password) {
                throw new common_1.NotFoundException('Admin has no password set');
            }
            const passwordMatch = await bcrypt.compare(_password, admin.password);
            if (!passwordMatch) {
                throw new common_1.NotFoundException('Invalid password');
            }
            if (admin.isSuspended) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            const tokens = await this.getTokens(admin.id, admin.email, 'admin', admin.type);
            await this.updateRefreshToken(admin.id, tokens.refresh_token, 'admin');
            await this.adminService.updateAdmin(admin.id, {
                lastLoginAt: new Date(),
                isActive: true,
            });
            return {
                ...tokens,
                admin: {
                    id: admin.id,
                    isAdmin: true,
                    isActive: true,
                    username: admin.username ?? '',
                    role: 'ADMIN',
                    type: admin.type
                }
            };
        }
        catch (error) {
            this.logger.error('Admin login error', error);
            throw error;
        }
    }
    async loginVendor(_email, _password) {
        try {
            const vendor = await this.vendorService.findByEmail(_email);
            if (!vendor) {
                throw new common_1.NotFoundException('Vendor not found');
            }
            if (!vendor.password) {
                throw new common_1.NotFoundException('Vendor has no password set');
            }
            const passwordMatch = await bcrypt.compare(_password, vendor.password);
            if (!passwordMatch) {
                throw new common_1.NotFoundException('Invalid password');
            }
            if (vendor.isSuspended) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            const tokens = await this.getTokens(vendor.id, vendor.email, 'vendor');
            await this.updateRefreshToken(vendor.id, tokens.refresh_token, 'vendor');
            await this.vendorService.updateVendor(vendor.id, {
                lastLoginAt: new Date(),
                isActive: true,
            });
            return {
                ...tokens,
                vendor: {
                    id: vendor.id,
                    isVendor: true,
                    isActive: true,
                    companyName: vendor.companyName,
                    role: 'VENDOR'
                }
            };
        }
        catch (error) {
            this.logger.error('Vendor login error', error);
            throw error;
        }
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return 'If an account with that email exists, a password reset link has been sent.';
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
        await this.userService.updateUser(user.id, {
            resetToken: resetCode,
            resetTokenExpiry,
        });
        try {
            await this.mailService.sendResetPasswordEmail(email, resetCode);
            this.logger.log(`Reset link generated for ${email}`);
        }
        catch (err) {
            this.logger.error(`Mail dispatch failed for ${email}`, err);
        }
        return 'If an account with that email exists, a password reset link has been sent.';
    }
    async resetPassword(token, newPassword) {
        const user = await this.userService.findByResetToken(token);
        if (!user || !user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (new Date() > user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        if (user.resetToken !== token) {
            throw new common_1.BadRequestException('Invalid reset token');
        }
        await this.userService.updateUser(user.id, {
            password: newPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });
        return 'Password has been reset successfully';
    }
    async deleteAccount(userId) {
        const user = await this.userService.findOneUser(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userService.updateUser(userId, {
            deletedAt: new Date(),
            isActive: false,
        });
        return 'Account deletion request submitted successfully';
    }
    async logout(userId, role) {
        if (role === 'user') {
            await this.userService.updateUser(userId, { refreshToken: null, isActive: false });
        }
        else if (role === 'admin') {
            await this.adminService.updateAdmin(userId, { refreshToken: null, isActive: false });
        }
        else if (role === 'vendor') {
            await this.vendorService.updateVendor(userId, { refreshToken: null, isActive: false });
        }
        else {
            throw new common_1.BadRequestException('Invalid user role for logout');
        }
        this.logger.log(`User ${userId} with role ${role} logged out successfully.`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        user_service_1.UserService,
        admin_service_1.AdminService,
        vendor_service_1.VendorService,
        specialist_service_1.SpecialistService,
        mail_service_1.MailService,
        prisma_email_verification_repository_1.PrismaEmailVerificationRepository,
        admin_notification_service_1.AdminNotificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map