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
var InvoiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
let InvoiceService = InvoiceService_1 = class InvoiceService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(InvoiceService_1.name);
    }
    async createInvoice(dto) {
        this.logger.log(`Creating invoice for Order ID: ${dto.orderId}`);
        const exists = await this.repo.findByInvoiceNumber(dto.invoiceNumber);
        if (exists) {
            this.logger.warn(`Attempted to create duplicate invoice number: ${dto.invoiceNumber}`);
            throw new common_1.BadRequestException('Invoice number already exists');
        }
        const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
        const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
        if (dueDate && dueDate < issueDate) {
            throw new common_1.BadRequestException('Due date cannot be before issue date');
        }
        return this.repo.create({
            ...dto,
            taxAmount: dto.taxAmount ?? 0,
            discountAmount: dto.discountAmount ?? 0,
            status: dto.status || 'DRAFT',
            issueDate,
            dueDate,
        });
    }
    async findInvoiceById(id) {
        const invoice = await this.repo.findById(id);
        if (!invoice) {
            this.logger.warn(`Invoice not found: ${id}`);
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    findInvoiceByNumber(invoiceNumber) {
        return this.repo.findByInvoiceNumber(invoiceNumber);
    }
    findInvoiceByOrderId(orderId) {
        return this.repo.findByOrderId(orderId);
    }
    findInvoicesByUserId(userId) {
        return this.repo.findByUserId(userId);
    }
    findAllInvoices() {
        return this.repo.findAll();
    }
    updateInvoice(id, dto) {
        this.logger.log(`Updating invoice: ${id}`);
        if (dto.issueDate && dto.dueDate) {
            if (new Date(dto.dueDate) < new Date(dto.issueDate)) {
                throw new common_1.BadRequestException('Due date cannot be before issue date');
            }
        }
        return this.repo.update(id, {
            ...dto,
            issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        });
    }
    deleteInvoice(id) {
        this.logger.log(`Deleting invoice: ${id}`);
        return this.repo.delete(id);
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = InvoiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IInvoiceRepository')),
    __metadata("design:paramtypes", [Object])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map