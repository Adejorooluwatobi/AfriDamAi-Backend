export declare class WishlistItemResponseDto {
    id: string;
    wishlistId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        basePrice: number;
        imageUrl?: string;
        isActive: boolean;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
    };
    createdAt: Date;
}
