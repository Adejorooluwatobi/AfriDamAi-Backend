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
var SpecialistService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const wallet_service_1 = require("./wallet.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let SpecialistService = SpecialistService_1 = class SpecialistService {
    constructor(specialistRepository, walletService, mailService) {
        this.specialistRepository = specialistRepository;
        this.walletService = walletService;
        this.mailService = mailService;
        this.logger = new common_1.Logger(SpecialistService_1.name);
    }
    async createSpecialist(params) {
        const existingSpecialist = await this.specialistRepository.findByEmail(params.email);
        if (existingSpecialist) {
            throw new common_1.ConflictException(`Specialist with email ${params.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(params.password, 10);
        const newSpecialist = await this.specialistRepository.create({
            ...params,
            password: hashedPassword,
        });
        this.logger.log(`Specialist created successfully: ${newSpecialist.id}`);
        await this.walletService.createWallet({
            ownerId: newSpecialist.id,
            ownerType: client_1.WalletOwnerType.SPECIALIST,
            initialBalance: 0,
        });
        this.logger.log(`Wallet created for specialist: ${newSpecialist.id}`);
        return newSpecialist;
    }
    async findById(id) {
        const specialist = await this.specialistRepository.findById(id);
        if (!specialist) {
            throw new common_1.NotFoundException(`Specialist with id ${id} not found`);
        }
        let wallet = null;
        try {
            wallet = await this.walletService.getWalletByOwner(id, client_1.WalletOwnerType.SPECIALIST);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.log(`Wallet not found for specialist ${id}, creating one...`);
                wallet = await this.walletService.createWallet({
                    ownerId: id,
                    ownerType: client_1.WalletOwnerType.SPECIALIST,
                    initialBalance: 0,
                });
            }
            else {
                throw error;
            }
        }
        return { specialist, wallet };
    }
    async findByEmail(email) {
        const specialist = await this.specialistRepository.findByEmail(email);
        if (!specialist) {
            throw new common_1.NotFoundException(`Specialist with email ${email} not found`);
        }
        return specialist;
    }
    async findByType(type) {
        return this.specialistRepository.findByType(type);
    }
    async findByStatus(status) {
        return this.specialistRepository.findByStatus(status);
    }
    async findByOrganization(organizationId) {
        const specialists = await this.specialistRepository.findByOrganization(organizationId);
        return Promise.all(specialists.map(async (specialist) => {
            let wallet = null;
            try {
                wallet = await this.walletService.getWalletByOwner(specialist.id, client_1.WalletOwnerType.SPECIALIST);
            }
            catch (error) {
            }
            return { specialist, wallet };
        }));
    }
    async findAll() {
        return this.specialistRepository.findAll();
    }
    async updateSpecialist(id, params) {
        const specialist = await this.findById(id);
        const updatedSpecialist = await this.specialistRepository.update(id, params);
        this.logger.log(`Specialist updated successfully: ${updatedSpecialist.id}`);
        return updatedSpecialist;
    }
    async deleteSpecialist(id) {
        await this.findById(id);
        await this.specialistRepository.delete(id);
        this.logger.log(`Specialist deleted successfully: ${id}`);
    }
    async updateSpecialistStatus(id, status) {
        await this.findById(id);
        const updatedSpecialist = await this.specialistRepository.update(id, { status });
        this.logger.log(`Specialist status updated successfully: ${updatedSpecialist.id} to ${status}`);
        return updatedSpecialist;
    }
    async updateSpecialistActiveStatus(id, isActive) {
        const specialist = await this.specialistRepository.findById(id);
        if (!specialist)
            throw new common_1.NotFoundException('Specialist not found');
        const updatedSpecialist = await this.specialistRepository.update(id, { isActive });
        this.logger.log(`Specialist active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
        await this.mailService.sendAccountStatusEmail(specialist.email, specialist.firstName || 'Specialist', isActive ? 'ACTIVATED' : 'DEACTIVATED', 'SPECIALIST');
        return updatedSpecialist;
    }
    async updateSpecialistSuspensionStatus(id, isSuspended) {
        const specialist = await this.specialistRepository.findById(id);
        if (!specialist)
            throw new common_1.NotFoundException('Specialist not found');
        const updatedSpecialist = await this.specialistRepository.update(id, { isSuspended });
        this.logger.log(`Specialist suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'not suspended'}`);
        await this.mailService.sendAccountStatusEmail(specialist.email, specialist.firstName || 'Specialist', isSuspended ? 'SUSPENDED' : 'UNSUSPENDED', 'SPECIALIST');
        return updatedSpecialist;
    }
};
exports.SpecialistService = SpecialistService;
exports.SpecialistService = SpecialistService = SpecialistService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ISpecialistRepository')),
    __metadata("design:paramtypes", [Object, wallet_service_1.WalletService,
        mail_service_1.MailService])
], SpecialistService);
//# sourceMappingURL=specialist.service.js.map