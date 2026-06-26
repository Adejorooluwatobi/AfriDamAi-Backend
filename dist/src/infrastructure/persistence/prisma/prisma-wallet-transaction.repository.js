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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaWalletTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const client_1 = require("@prisma/client");
const wallet_transaction_mapper_1 = require("../../mappers/wallet-transaction.mapper");
let PrismaWalletTransactionRepository = class PrismaWalletTransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(walletId, type, amount, description, relatedEntityId, relatedEntityType) {
        const prismaTransaction = await this.prisma.walletTransaction.create({
            data: {
                walletId,
                type,
                amount,
                description,
                relatedEntityId,
                relatedEntityType,
            },
        });
        return wallet_transaction_mapper_1.WalletTransactionMapper.toDomain(prismaTransaction);
    }
    async findById(id) {
        const prismaTransaction = await this.prisma.walletTransaction.findUnique({
            where: { id },
            include: { wallet: true },
        });
        return prismaTransaction ? wallet_transaction_mapper_1.WalletTransactionMapper.toDomain(prismaTransaction) : null;
    }
    async findByWalletId(walletId) {
        const prismaTransactions = await this.prisma.walletTransaction.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' },
            include: { wallet: true },
        });
        return prismaTransactions.map(wallet_transaction_mapper_1.WalletTransactionMapper.toDomain);
    }
    async findByRelatedEntity(relatedEntityId, relatedEntityType) {
        const prismaTransactions = await this.prisma.walletTransaction.findMany({
            where: { relatedEntityId, relatedEntityType },
            orderBy: { createdAt: 'desc' },
            include: { wallet: true },
        });
        return prismaTransactions.map(wallet_transaction_mapper_1.WalletTransactionMapper.toDomain);
    }
    async getTotals(walletId) {
        const totals = await this.prisma.walletTransaction.groupBy({
            by: ['type'],
            where: { walletId },
            _sum: {
                amount: true,
            },
        });
        const result = { totalIn: 0, totalOut: 0 };
        totals.forEach((t) => {
            if (t.type === client_1.WalletTransactionType.CREDIT) {
                result.totalIn = t._sum.amount || 0;
            }
            else if (t.type === client_1.WalletTransactionType.DEBIT) {
                result.totalOut = t._sum.amount || 0;
            }
        });
        return result;
    }
};
exports.PrismaWalletTransactionRepository = PrismaWalletTransactionRepository;
exports.PrismaWalletTransactionRepository = PrismaWalletTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaWalletTransactionRepository);
//# sourceMappingURL=prisma-wallet-transaction.repository.js.map