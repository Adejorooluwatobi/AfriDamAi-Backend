export declare class CreateProductDto {
    name: string;
    description: string;
    basePrice: number;
    vendorId?: string;
    primaryCategoryId?: string | null;
    secondaryCategoryIds?: string[];
    imageUrl?: string;
    isActive?: boolean;
    stock?: number;
}
