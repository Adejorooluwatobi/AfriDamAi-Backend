"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceMapper = void 0;
class InvoiceMapper {
    static toDomain(raw) {
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
            status: raw.status,
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
exports.InvoiceMapper = InvoiceMapper;
//# sourceMappingURL=invoice.mapper.js.map