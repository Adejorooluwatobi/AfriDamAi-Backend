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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let AdminService = class AdminService {
    constructor(adminRepository, prisma, mailService) {
        this.adminRepository = adminRepository;
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async createAdmin(adminDetails) {
        if (!adminDetails.email || !adminDetails.password) {
            throw new common_1.NotFoundException('Email and password are required');
        }
        const existingAdmin = await this.adminRepository.findByEmail(adminDetails.email);
        if (existingAdmin) {
            throw new common_1.ConflictException(`Admin with email ${adminDetails.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
        const newAdmin = await this.adminRepository.create({
            ...adminDetails,
            password: hashedPassword,
            isActive: true,
        });
        console.log('Admin created successfully:', newAdmin.id);
        return newAdmin;
    }
    async findAllAdmin() {
        const admins = await this.adminRepository.findAll();
        return admins;
    }
    async findOneAdmin(id) {
        const admin = await this.adminRepository.findById(id);
        return admin;
    }
    async updateAdmin(id, updateAdminDetails) {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with id ${id} not found`);
        }
        if (updateAdminDetails.password) {
            updateAdminDetails.password = await bcrypt.hash(updateAdminDetails.password, 10);
        }
        const finalUpdate = {
            ...admin,
            ...updateAdminDetails,
        };
        const updatedAdmin = await this.adminRepository.update(id, finalUpdate);
        console.log('Admin updated successfully:', updatedAdmin.id);
        return updatedAdmin;
    }
    async updateAdminActiveStatus(id, isActive) {
        const admin = await this.adminRepository.findById(id);
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const updated = await this.adminRepository.update(id, { isActive });
        await this.mailService.sendAccountStatusEmail(admin.email, admin.firstName || 'Administrator', isActive ? 'ACTIVATED' : 'DEACTIVATED', 'ADMIN');
        return updated;
    }
    async updateAdminSuspensionStatus(id, isSuspended) {
        const admin = await this.adminRepository.findById(id);
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const updated = await this.adminRepository.update(id, { isSuspended });
        await this.mailService.sendAccountStatusEmail(admin.email, admin.firstName || 'Administrator', isSuspended ? 'SUSPENDED' : 'UNSUSPENDED', 'ADMIN');
        return updated;
    }
    async deleteAdmin(id) {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with id ${id} not found`);
        }
        await this.adminRepository.delete(id);
        console.log('Admin deleted successfully:', admin.id);
    }
    async findByEmail(email) {
        const admin = await this.adminRepository.findByEmail(email);
        return admin;
    }
    async findByRole(role) {
        const admins = await this.adminRepository.findByRole(role);
        return admins;
    }
    async getWebhookLogs() {
        return this.prisma.webhookLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAdminRepository')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AdminService);
//# sourceMappingURL=admin.service.js.map