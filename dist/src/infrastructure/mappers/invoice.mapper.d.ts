import { InvoiceEntity } from 'src/domain/entities/invoice.entity';
import { Invoice, InvoiceItem } from '@prisma/client';
type InvoiceWithItems = Invoice & {
    items?: InvoiceItem[];
};
export declare class InvoiceMapper {
    static toDomain(raw: InvoiceWithItems): InvoiceEntity;
}
export {};
