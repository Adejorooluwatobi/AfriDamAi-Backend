export declare class UpdateProductDto {
    name?: string;
    description?: string;
    basePrice: number;
    primaryCategoryId?: string | null;
    secondaryCategoryIds?: string[];
    isActive?: boolean;
    stock?: number;
    imageUrl?: string;
}
