export declare class ReviewEntity {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ReviewEntity>);
}
