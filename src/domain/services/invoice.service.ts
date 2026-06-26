import {
    Injectable,
    Inject,
    BadRequestException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import type { InvoiceRepositoryInterface } from 'src/domain/repositories/invoice.repository.interface';
import { CreateInvoiceDto } from 'src/application/DTOs/invoice/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/DTOs/invoice/update-invoice.dto';

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);

    constructor(
        @Inject('IInvoiceRepository')
        private readonly repo: InvoiceRepositoryInterface,
    ) { }

    async createInvoice(dto: CreateInvoiceDto & { status?: string }) {
        this.logger.log(`Creating invoice for Order ID: ${dto.orderId}`);

        const exists = await this.repo.findByInvoiceNumber(dto.invoiceNumber);
        if (exists) {
            this.logger.warn(`Attempted to create duplicate invoice number: ${dto.invoiceNumber}`);
            throw new BadRequestException('Invoice number already exists');
        }

        const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
        const dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;

        if (dueDate && dueDate < issueDate) {
            throw new BadRequestException('Due date cannot be before issue date');
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

    async findInvoiceById(id: string) {
        const invoice = await this.repo.findById(id);
        if (!invoice) {
            this.logger.warn(`Invoice not found: ${id}`);
            throw new NotFoundException('Invoice not found');
        }
        return invoice;
    }

    findInvoiceByNumber(invoiceNumber: string) {
        return this.repo.findByInvoiceNumber(invoiceNumber);
    }

    findInvoiceByOrderId(orderId: string) {
        return this.repo.findByOrderId(orderId);
    }

    findInvoicesByUserId(userId: string) {
        return this.repo.findByUserId(userId);
    }

    findAllInvoices() {
        return this.repo.findAll();
    }

    updateInvoice(id: string, dto: UpdateInvoiceDto) {
        this.logger.log(`Updating invoice: ${id}`);
        
        if (dto.issueDate && dto.dueDate) {
            if (new Date(dto.dueDate) < new Date(dto.issueDate)) {
                throw new BadRequestException('Due date cannot be before issue date');
            }
        }

        return this.repo.update(id, {
            ...dto,
            issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        });
    }

    deleteInvoice(id: string) {
        this.logger.log(`Deleting invoice: ${id}`);
        return this.repo.delete(id);
    }
}
