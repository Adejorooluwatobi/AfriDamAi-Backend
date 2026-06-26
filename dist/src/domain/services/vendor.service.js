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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const wallet_service_1 = require("./wallet.service");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
let VendorService = class VendorService {
    constructor(vendorRepository, walletService, mailService) {
        this.vendorRepository = vendorRepository;
        this.walletService = walletService;
        this.mailService = mailService;
    }
    async createVendor(vendorDetails) {
        if (!vendorDetails.email || !vendorDetails.password) {
            throw new common_1.NotFoundException('Email and password are required');
        }
        const existingVendor = await this.vendorRepository.findByEmail(vendorDetails.email);
        if (existingVendor) {
            throw new common_1.ConflictException(`Vendor with email ${vendorDetails.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(vendorDetails.password, 10);
        const newVendor = await this.vendorRepository.create({
            ...vendorDetails,
            password: hashedPassword,
            isActive: true,
        });
        console.log('Vendor created successfully:', newVendor.id);
        await this.walletService.createWallet({
            ownerId: newVendor.id,
            ownerType: client_1.WalletOwnerType.VENDOR,
            initialBalance: 0,
        });
        console.log(`Wallet created for vendor: ${newVendor.id}`);
        return newVendor;
    }
    async findAllVendor() {
        const vendors = await this.vendorRepository.findAll();
        return vendors;
    }
    async findOneVendor(id) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            return null;
        }
        let wallet = null;
        try {
            wallet = await this.walletService.getWalletByOwner(id, client_1.WalletOwnerType.VENDOR);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                console.log(`Wallet not found for vendor ${id}, creating one...`);
                wallet = await this.walletService.createWallet({
                    ownerId: id,
                    ownerType: client_1.WalletOwnerType.VENDOR,
                    initialBalance: 0,
                });
            }
            else {
                throw error;
            }
        }
        return { vendor, wallet };
    }
    async updateVendor(id, updateVendorDetails) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        }
        if (updateVendorDetails.password) {
            updateVendorDetails.password = await bcrypt.hash(updateVendorDetails.password, 10);
        }
        const finalUpdate = {
            ...vendor,
            ...updateVendorDetails,
        };
        const updatedVendor = await this.vendorRepository.update(id, finalUpdate);
        console.log('Vendor updated successfully:', updatedVendor.id);
        return updatedVendor;
    }
    async deleteVendor(id) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        }
        await this.vendorRepository.delete(id);
        console.log('Vendor deleted successfully:', vendor.id);
    }
    async updateVendorActiveStatus(id, isActive) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        const updatedVendor = await this.vendorRepository.update(id, { isActive });
        console.log(`Vendor active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
        await this.mailService.sendAccountStatusEmail(vendor.email, vendor.companyName || 'Vendor', isActive ? 'ACTIVATED' : 'DEACTIVATED', 'VENDOR');
        return updatedVendor;
    }
    async updateVendorSuspensionStatus(id, isSuspended) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        const updatedVendor = await this.vendorRepository.update(id, { isSuspended });
        console.log(`Vendor suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'active'}`);
        await this.mailService.sendAccountStatusEmail(vendor.email, vendor.companyName || 'Vendor', isSuspended ? 'SUSPENDED' : 'UNSUSPENDED', 'VENDOR');
        return updatedVendor;
    }
    async updateVendorApprovalStatus(id, status) {
        const vendor = await this.vendorRepository.findById(id);
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor with id ${id} not found`);
        const updatedVendor = await this.vendorRepository.update(id, { status });
        console.log(`Vendor approval status updated: ${id} to ${status}`);
        return updatedVendor;
    }
    async findByEmail(email) {
        const vendor = await this.vendorRepository.findByEmail(email);
        return vendor;
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IVendorRepository')),
    __metadata("design:paramtypes", [Object, wallet_service_1.WalletService,
        mail_service_1.MailService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map