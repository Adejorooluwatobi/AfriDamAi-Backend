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
exports.PrismaWithdrawalRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const client_1 = require("@prisma/client");
const withdrawal_request_mapper_1 = require("../../mappers/withdrawal-request.mapper");
let PrismaWithdrawalRequestRepository = class PrismaWithdrawalRequestRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(walletId, amount, requestedById, requestedByType) {
        const prismaRequest = await this.prisma.withdrawalRequest.create({
            data: {
                walletId,
                amount,
                requestedById,
                requestedByType,
                status: client_1.WithdrawalStatus.PENDING,
            },
        });
        return withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain(prismaRequest);
    }
    async findById(id) {
        const prismaRequest = await this.prisma.withdrawalRequest.findUnique({
            where: { id },
            include: { wallet: true },
        });
        return prismaRequest ? withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain(prismaRequest) : null;
    }
    async findByWalletId(walletId) {
        const prismaRequests = await this.prisma.withdrawalRequest.findMany({
            where: { walletId },
            orderBy: { requestedAt: 'desc' },
            include: { wallet: true },
        });
        return prismaRequests.map(withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain);
    }
    async findByStatus(status) {
        const prismaRequests = await this.prisma.withdrawalRequest.findMany({
            where: { status },
            orderBy: { requestedAt: 'desc' },
            include: { wallet: true },
        });
        return prismaRequests.map(withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain);
    }
    async update(id, data) {
        const prismaRequest = await this.prisma.withdrawalRequest.update({
            where: { id },
            data: withdrawal_request_mapper_1.WithdrawalRequestMapper.toPersistence(data),
        });
        return withdrawal_request_mapper_1.WithdrawalRequestMapper.toDomain(prismaRequest);
    }
};
exports.PrismaWithdrawalRequestRepository = PrismaWithdrawalRequestRepository;
exports.PrismaWithdrawalRequestRepository = PrismaWithdrawalRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaWithdrawalRequestRepository);
//# sourceMappingURL=prisma-withdrawal-request.repository.js.map