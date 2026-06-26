import { InvoiceEntity, InvoiceItemEntity } from 'src/domain/entities/invoice.entity';
import { Invoice, InvoiceItem } from '@prisma/client';

type InvoiceWithItems = Invoice & {
  items?: InvoiceItem[];
};

export class InvoiceMapper {
    static toDomain(raw: InvoiceWithItems): InvoiceEntity {
        return {
          id: raw.id,
          invoiceNumber: raw.invoiceNumber,
          orderId: raw.orderId,
          userId: raw.userId,
          issueDate: raw.issueDate,
          dueDate: raw.dueDate ?? undefined,
          totalAmount: raw.totalAmount,
          taxAmount: raw.taxAmount,
          discountAmount: raw.discountAmount,
          netAmount: raw.netAmount,
          status: raw.status as any, // TODO: Use Enum from Entity
          notes: raw.notes ?? undefined,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
          items: raw.items?.map((i) => ({
            id: i.id,
            invoiceId: i.invoiceId,
            productId: i.productId,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt,
          })) ?? [],
        };
    }
}
