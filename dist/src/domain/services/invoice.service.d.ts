import type { InvoiceRepositoryInterface } from 'src/domain/repositories/invoice.repository.interface';
import { CreateInvoiceDto } from 'src/application/DTOs/invoice/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/DTOs/invoice/update-invoice.dto';
export declare class InvoiceService {
    private readonly repo;
    private readonly logger;
    constructor(repo: InvoiceRepositoryInterface);
    createInvoice(dto: CreateInvoiceDto & {
        status?: string;
    }): Promise<import("../entities/invoice.entity").InvoiceEntity>;
    findInvoiceById(id: string): Promise<import("../entities/invoice.entity").InvoiceEntity>;
    findInvoiceByNumber(invoiceNumber: string): Promise<import("../entities/invoice.entity").InvoiceEntity>;
    findInvoiceByOrderId(orderId: string): Promise<import("../entities/invoice.entity").InvoiceEntity>;
    findInvoicesByUserId(userId: string): Promise<import("../entities/invoice.entity").InvoiceEntity[]>;
    findAllInvoices(): Promise<import("../entities/invoice.entity").InvoiceEntity[]>;
    updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<import("../entities/invoice.entity").InvoiceEntity>;
    deleteInvoice(id: string): Promise<void>;
}
