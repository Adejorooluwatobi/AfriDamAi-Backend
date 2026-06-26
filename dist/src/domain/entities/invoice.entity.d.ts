export declare class InvoiceEntity {
    id: string;
    invoiceNumber: string;
    orderId: string;
    userId: string;
    issueDate: Date;
    dueDate?: Date;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    netAmount: number;
    status: string;
    notes?: string;
    items?: InvoiceItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class InvoiceItemEntity {
    id: string;
    invoiceId: string;
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
