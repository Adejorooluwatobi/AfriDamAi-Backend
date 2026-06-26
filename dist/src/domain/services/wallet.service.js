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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let WalletService = class WalletService {
    constructor(walletRepository, walletTransactionRepository, userRepository, vendorRepository, specialistRepository, adminRepository) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.specialistRepository = specialistRepository;
        this.adminRepository = adminRepository;
    }
    async createWallet(params) {
        const { ownerId, ownerType, initialBalance } = params;
        await this.validateOwner(ownerId, ownerType);
        const existingWallet = await this.walletRepository.findByOwnerIdAndType(ownerId, ownerType);
        if (existingWallet) {
            throw new common_1.ConflictException(`Wallet already exists for ${ownerType} with ID ${ownerId}`);
        }
        return this.walletRepository.create(ownerId, ownerType, initialBalance);
    }
    async getWalletById(id) {
        const wallet = await this.walletRepository.findById(id);
        if (!wallet) {
            throw new common_1.NotFoundException(`Wallet with ID ${id} not found`);
        }
        const totals = await this.walletTransactionRepository.getTotals(wallet.id);
        wallet.totalIn = totals.totalIn;
        wallet.totalOut = totals.totalOut;
        return wallet;
    }
    async getWalletByOwner(ownerId, ownerType) {
        const wallet = await this.walletRepository.findByOwnerIdAndType(ownerId, ownerType);
        if (!wallet) {
            throw new common_1.NotFoundException(`Wallet not found for ${ownerType} with ID ${ownerId}`);
        }
        const totals = await this.walletTransactionRepository.getTotals(wallet.id);
        wallet.totalIn = totals.totalIn;
        wallet.totalOut = totals.totalOut;
        return wallet;
    }
    async findAllWalletsByOwnerType(ownerType) {
        return this.walletRepository.findAllByOwnerType(ownerType);
    }
    async deleteWallet(id) {
        return this.walletRepository.delete(id);
    }
    async creditWallet(walletId, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Credit amount must be positive');
        }
        return this.walletRepository.updateBalance(walletId, amount);
    }
    async debitWallet(walletId, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Debit amount must be positive');
        }
        const wallet = await this.getWalletById(walletId);
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        return this.walletRepository.updateBalance(walletId, -amount);
    }
    async transferFunds(fromWalletId, toWalletId, amount, description, relatedEntityId, relatedEntityType) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Transfer amount must be positive');
        }
        const fromWallet = await this.getWalletById(fromWalletId);
        const toWallet = await this.getWalletById(toWalletId);
        if (fromWallet.balance < amount) {
            throw new common_1.BadRequestException(`Insufficient balance in wallet ${fromWalletId} for transfer`);
        }
        const debitedWallet = await this.debitWallet(fromWalletId, amount);
        const creditedWallet = await this.creditWallet(toWalletId, amount);
        return { fromWallet: debitedWallet, toWallet: creditedWallet };
    }
    async updateWallet(id, params) {
        const existingWallet = await this.getWalletById(id);
        return this.walletRepository.update(id, { ...existingWallet, ...params });
    }
    async validateOwner(ownerId, ownerType) {
        switch (ownerType) {
            case client_1.WalletOwnerType.USER:
                const user = await this.userRepository.findById(ownerId);
                if (!user)
                    throw new common_1.NotFoundException(`User with ID ${ownerId} not found`);
                break;
            case client_1.WalletOwnerType.VENDOR:
                const vendor = await this.vendorRepository.findById(ownerId);
                if (!vendor)
                    throw new common_1.NotFoundException(`Vendor with ID ${ownerId} not found`);
                break;
            case client_1.WalletOwnerType.SPECIALIST:
                const specialist = await this.specialistRepository.findById(ownerId);
                if (!specialist)
                    throw new common_1.NotFoundException(`Specialist with ID ${ownerId} not found`);
                break;
            case client_1.WalletOwnerType.ORGANIZATION:
                const admin = await this.adminRepository.findById(ownerId);
                if (!admin)
                    throw new common_1.NotFoundException(`Admin (Organization Owner) with ID ${ownerId} not found`);
                break;
            default:
                throw new common_1.BadRequestException(`Invalid owner type: ${ownerType}`);
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IWalletRepository')),
    __param(1, (0, common_1.Inject)('IWalletTransactionRepository')),
    __param(2, (0, common_1.Inject)('IUserRepository')),
    __param(3, (0, common_1.Inject)('IVendorRepository')),
    __param(4, (0, common_1.Inject)('ISpecialistRepository')),
    __param(5, (0, common_1.Inject)('IAdminRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], WalletService);
//# sourceMappingURL=wallet.service.js.map