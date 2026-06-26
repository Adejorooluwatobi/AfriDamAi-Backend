import { InvoiceService } from 'src/domain/services/invoice.service';
import { CreateInvoiceDto } from 'src/application/DTOs/invoice/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/DTOs/invoice/update-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(dto: CreateInvoiceDto): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity>;
    findAll(): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity[]>;
    findByNumber(invoiceNumber: string): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity>;
    findByOrder(orderId: string): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity>;
    findByUser(userId: string): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity[]>;
    findById(id: string): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity>;
    update(id: string, dto: UpdateInvoiceDto): Promise<import("../../domain/entities/invoice.entity").InvoiceEntity>;
    delete(id: string): Promise<void>;
}
