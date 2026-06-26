declare class CreateInvoiceItemDto {
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export declare class CreateInvoiceDto {
    invoiceNumber: string;
    orderId: string;
    userId: string;
    issueDate?: string;
    dueDate?: string;
    totalAmount: number;
    taxAmount?: number;
    discountAmount?: number;
    netAmount: number;
    notes?: string;
    items: CreateInvoiceItemDto[];
}
export {};
