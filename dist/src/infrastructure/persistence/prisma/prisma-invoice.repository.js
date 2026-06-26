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
exports.PrismaInvoiceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const invoice_mapper_1 = require("../../mappers/invoice.mapper");
const client_1 = require("@prisma/client");
let PrismaInvoiceRepository = class PrismaInvoiceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const { items = [], ...invoice } = data;
            const result = await this.prisma.invoice.create({
                data: {
                    ...invoice,
                    items: {
                        create: items.map((i) => ({
                            productId: i.productId,
                            description: i.description || 'Product',
                            quantity: i.quantity,
                            unitPrice: i.unitPrice,
                            totalPrice: i.totalPrice,
                        })),
                    },
                },
                include: { items: true },
            });
            return invoice_mapper_1.InvoiceMapper.toDomain(result);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.BadRequestException('Duplicate invoice');
                }
                if (e.code === 'P2003') {
                    throw new common_1.BadRequestException('Invalid orderId or userId (foreign key violation)');
                }
            }
            throw e;
        }
    }
    async findById(id) {
        const result = await this.prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });
        return result ? invoice_mapper_1.InvoiceMapper.toDomain(result) : null;
    }
    async findByInvoiceNumber(invoiceNumber) {
        const result = await this.prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: { items: true },
        });
        return result ? invoice_mapper_1.InvoiceMapper.toDomain(result) : null;
    }
    async findByOrderId(orderId) {
        const result = await this.prisma.invoice.findUnique({
            where: { orderId },
            include: { items: true },
        });
        return result ? invoice_mapper_1.InvoiceMapper.toDomain(result) : null;
    }
    async findByUserId(userId) {
        const results = await this.prisma.invoice.findMany({
            where: { userId },
            include: { items: true },
        });
        return results.map(invoice_mapper_1.InvoiceMapper.toDomain);
    }
    async findAll() {
        const results = await this.prisma.invoice.findMany({
            include: { items: true },
        });
        return results.map(invoice_mapper_1.InvoiceMapper.toDomain);
    }
    async update(id, data) {
        const result = await this.prisma.invoice.update({
            where: { id },
            data,
            include: { items: true },
        });
        return invoice_mapper_1.InvoiceMapper.toDomain(result);
    }
    async delete(id) {
        await this.prisma.invoice.delete({ where: { id } });
    }
};
exports.PrismaInvoiceRepository = PrismaInvoiceRepository;
exports.PrismaInvoiceRepository = PrismaInvoiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaInvoiceRepository);
//# sourceMappingURL=prisma-invoice.repository.js.map