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
exports.WalletTransactionService = void 0;
const common_1 = require("@nestjs/common");
let WalletTransactionService = class WalletTransactionService {
    constructor(walletTransactionRepository) {
        this.walletTransactionRepository = walletTransactionRepository;
    }
    async createWalletTransaction(params) {
        const { walletId, type, amount, description, relatedEntityId, relatedEntityType } = params;
        return this.walletTransactionRepository.create(walletId, type, amount, description, relatedEntityId, relatedEntityType);
    }
    async getWalletTransactionById(id) {
        const transaction = await this.walletTransactionRepository.findById(id);
        if (!transaction) {
            throw new common_1.NotFoundException(`Wallet Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async getWalletTransactionsByWalletId(walletId) {
        return this.walletTransactionRepository.findByWalletId(walletId);
    }
    async getWalletTransactionsByRelatedEntity(relatedEntityId, relatedEntityType) {
        return this.walletTransactionRepository.findByRelatedEntity(relatedEntityId, relatedEntityType);
    }
};
exports.WalletTransactionService = WalletTransactionService;
exports.WalletTransactionService = WalletTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IWalletTransactionRepository')),
    __metadata("design:paramtypes", [Object])
], WalletTransactionService);
//# sourceMappingURL=wallet-transaction.service.js.map