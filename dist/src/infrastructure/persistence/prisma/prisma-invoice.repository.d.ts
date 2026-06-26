import { PrismaService } from './prisma.service';
import { InvoiceRepositoryInterface } from '../../../domain/repositories/invoice.repository.interface';
import { InvoiceEntity } from 'src/domain/entities/invoice.entity';
export declare class PrismaInvoiceRepository implements InvoiceRepositoryInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<InvoiceEntity>;
    findById(id: string): Promise<InvoiceEntity | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceEntity | null>;
    findByOrderId(orderId: string): Promise<InvoiceEntity | null>;
    findByUserId(userId: string): Promise<InvoiceEntity[]>;
    findAll(): Promise<InvoiceEntity[]>;
    update(id: string, data: any): Promise<InvoiceEntity>;
    delete(id: string): Promise<void>;
}
