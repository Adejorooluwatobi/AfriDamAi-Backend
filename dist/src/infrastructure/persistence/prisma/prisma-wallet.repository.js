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
exports.PrismaWalletRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const wallet_mapper_1 = require("../../mappers/wallet.mapper");
let PrismaWalletRepository = class PrismaWalletRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(ownerId, ownerType, initialBalance = 0) {
        const prismaWallet = await this.prisma.wallet.create({
            data: {
                ownerId,
                ownerType,
                balance: initialBalance,
            },
        });
        return wallet_mapper_1.WalletMapper.toDomain(prismaWallet);
    }
    async findById(id) {
        const prismaWallet = await this.prisma.wallet.findUnique({
            where: { id },
            include: { transactions: true, withdrawalRequests: true },
        });
        return prismaWallet ? wallet_mapper_1.WalletMapper.toDomain(prismaWallet) : null;
    }
    async findByOwnerIdAndType(ownerId, ownerType) {
        const prismaWallet = await this.prisma.wallet.findUnique({
            where: {
                ownerId_ownerType: {
                    ownerId,
                    ownerType,
                },
            },
            include: { transactions: true, withdrawalRequests: true },
        });
        return prismaWallet ? wallet_mapper_1.WalletMapper.toDomain(prismaWallet) : null;
    }
    async findAllByOwnerType(ownerType) {
        const prismaWallets = await this.prisma.wallet.findMany({
            where: { ownerType },
            include: { transactions: true, withdrawalRequests: true },
        });
        return prismaWallets.map(wallet_mapper_1.WalletMapper.toDomain);
    }
    async updateBalance(id, amount) {
        const prismaWallet = await this.prisma.wallet.update({
            where: { id },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
        return wallet_mapper_1.WalletMapper.toDomain(prismaWallet);
    }
    async update(id, data) {
        const prismaWallet = await this.prisma.wallet.update({
            where: { id },
            data: wallet_mapper_1.WalletMapper.toPersistence(data),
        });
        return wallet_mapper_1.WalletMapper.toDomain(prismaWallet);
    }
    async delete(id) {
        await this.prisma.wallet.delete({ where: { id } });
    }
};
exports.PrismaWalletRepository = PrismaWalletRepository;
exports.PrismaWalletRepository = PrismaWalletRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaWalletRepository);
//# sourceMappingURL=prisma-wallet.repository.js.map