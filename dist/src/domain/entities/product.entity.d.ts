import { ReviewEntity } from './review.entity';
import { VendorEntity } from './vendor.entity';
export declare class ProductEntity {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    basePrice: number;
    imageUrl?: string;
    primaryCategory?: {
        id: string;
        name: string;
    } | null;
    secondaryCategories?: {
        id: string;
        name: string;
    }[];
    isActive: boolean;
    stock: number;
    reviews?: ReviewEntity[];
    averageRating?: number;
    createdAt: Date;
    updatedAt: Date;
    vendorId?: string;
    vendor?: VendorEntity | null;
    constructor(partial: Partial<ProductEntity>);
}
