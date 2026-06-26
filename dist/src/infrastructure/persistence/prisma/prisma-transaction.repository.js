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
exports.PrismaTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const transaction_mapper_1 = require("../../mappers/transaction.mapper");
let PrismaTransactionRepository = class PrismaTransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const transaction = await this.prisma.transaction.create({
            data: params,
        });
        return transaction_mapper_1.TransactionMapper.toDomain(transaction);
    }
    async get() {
        const transaction = await this.prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return transaction.map(transaction_mapper_1.TransactionMapper.toDomain);
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });
        return transaction ? transaction_mapper_1.TransactionMapper.toDomain(transaction) : null;
    }
    async findByOrderId(orderId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { orderId },
        });
        return transaction ? transaction_mapper_1.TransactionMapper.toDomain(transaction) : null;
    }
    async findByAppointmentId(appointmentId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { appointmentId },
        });
        return transaction ? transaction_mapper_1.TransactionMapper.toDomain(transaction) : null;
    }
    async findByGatewayTransactionId(gatewayTransactionId) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { gatewayTransactionId },
        });
        return transaction ? transaction_mapper_1.TransactionMapper.toDomain(transaction) : null;
    }
    async findByUserId(userId) {
        const transactions = await this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return transactions.map(transaction_mapper_1.TransactionMapper.toDomain);
    }
    async update(id, params) {
        const transaction = await this.prisma.transaction.update({
            where: { id },
            data: params,
        });
        return transaction_mapper_1.TransactionMapper.toDomain(transaction);
    }
    async delete(id) {
        await this.prisma.transaction.delete({
            where: { id },
        });
    }
    async findPendingTransactionsOlderThan(date) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: date,
                },
            },
        });
        return transactions.map(transaction_mapper_1.TransactionMapper.toDomain);
    }
};
exports.PrismaTransactionRepository = PrismaTransactionRepository;
exports.PrismaTransactionRepository = PrismaTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTransactionRepository);
//# sourceMappingURL=prisma-transaction.repository.js.map