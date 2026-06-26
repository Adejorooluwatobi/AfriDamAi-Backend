import { InvoiceEntity } from "../entities/invoice.entity";

export interface InvoiceRepositoryInterface {
    create(data: any): Promise<InvoiceEntity>;
    findById(id: string): Promise<InvoiceEntity | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceEntity | null>;
    findByOrderId(orderId: string): Promise<InvoiceEntity | null>;
    findByUserId(userId: string): Promise<InvoiceEntity[]>;
    findAll(): Promise<InvoiceEntity[]>;
    update(id: string, data: any): Promise<InvoiceEntity>;
    delete(id: string): Promise<void>;
}
