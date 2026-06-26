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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const wallet_service_1 = require("./wallet.service");
const client_1 = require("@prisma/client");
const file_upload_service_1 = require("../../shared/services/file-upload.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let UserService = UserService_1 = class UserService {
    constructor(userRepository, walletService, fileUploadService, mailService) {
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.fileUploadService = fileUploadService;
        this.mailService = mailService;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async createUser(userDetails) {
        if (!userDetails.email || !userDetails.password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const existingUser = await this.userRepository.findByEmail(userDetails.email);
        if (existingUser) {
            throw new common_1.ConflictException(`User with email ${userDetails.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        const newUser = await this.userRepository.create({
            ...userDetails,
            password: hashedPassword,
            isActive: userDetails.isActive ?? true
        });
        this.logger.log(`User created successfully: ${newUser.id}`);
        await this.walletService.createWallet({
            ownerId: newUser.id,
            ownerType: client_1.WalletOwnerType.USER,
            initialBalance: 0,
        });
        this.logger.log(`Wallet created for user: ${newUser.id}`);
        return newUser;
    }
    async updateUser(id, updateUserDetails) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        if (updateUserDetails.password) {
            updateUserDetails.password = await bcrypt.hash(updateUserDetails.password, 10);
        }
        const finalUpdate = {
            ...updateUserDetails,
        };
        if (updateUserDetails.onboardingCompleted !== undefined) {
            finalUpdate.onboardingCompleted = updateUserDetails.onboardingCompleted;
        }
        if (updateUserDetails.profile) {
            finalUpdate.profile = {
                ...(user.profile || {}),
                ...updateUserDetails.profile,
                onboardingCompleted: updateUserDetails.onboardingCompleted ?? user.onboardingCompleted
            };
        }
        const updatedUser = await this.userRepository.update(id, finalUpdate);
        this.logger.log(`User updated successfully: ${updatedUser.id}`);
        return updatedUser;
    }
    async updateUserAvatar(id, file) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        this.logger.log(`Uploading avatar for user: ${id}`);
        const avatarUrl = await this.fileUploadService.uploadImageFile(file);
        const updateParams = {
            profile: {
                ...(user.profile || {}),
                avatarUrl: avatarUrl
            }
        };
        return this.userRepository.update(id, updateParams);
    }
    async findAllUser() {
        return this.userRepository.findAll();
    }
    async findOneUser(id) {
        return this.userRepository.findById(id);
    }
    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        await this.userRepository.delete(id);
        this.logger.log(`User deleted successfully: ${user.id}`);
    }
    async updateUserActiveStatus(id, isActive) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        const updatedUser = await this.userRepository.update(id, { isActive });
        this.logger.log(`User active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
        await this.mailService.sendAccountStatusEmail(user.email, user.firstName || 'User', isActive ? 'ACTIVATED' : 'DEACTIVATED', 'CLIENT');
        return updatedUser;
    }
    async updateUserSuspensionStatus(id, isSuspended) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        const updatedUser = await this.userRepository.update(id, { isSuspended });
        this.logger.log(`User suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'unsuspended'}`);
        await this.mailService.sendAccountStatusEmail(user.email, user.firstName || 'User', isSuspended ? 'SUSPENDED' : 'UNSUSPENDED', 'CLIENT');
        return updatedUser;
    }
    async findByEmail(email) {
        if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
            throw new common_1.BadRequestException('Valid email is required');
        }
        const sanitizedEmail = email.trim();
        return this.userRepository.findByEmail(sanitizedEmail);
    }
    async findByResetToken(resetToken) {
        if (!resetToken || typeof resetToken !== 'string') {
            throw new common_1.BadRequestException('Valid reset token is required');
        }
        const sanitizedToken = this.sanitizeInput(resetToken);
        return this.userRepository.findByResetToken(sanitizedToken);
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    sanitizeInput(input) {
        return input.replace(/[\r\n\t]/g, '').trim();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, wallet_service_1.WalletService,
        file_upload_service_1.FileUploadService,
        mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map