import { ProductEntity } from 'src/domain/entities/product.entity';
import { Product, ProductCategory } from '@prisma/client';
type ProductWithRelations = Product & {
    primaryCategory?: {
        id: string;
        name: string;
    } | null;
    productCategories?: (ProductCategory & {
        category: {
            id: string;
            name: string;
        };
    })[];
};
export declare class ProductMapper {
    static toDomain(raw: ProductWithRelations): ProductEntity;
    static toPrisma(entity: ProductEntity): {
        id: string;
        name: string;
        slug: string;
        description: string;
        basePrice: number;
        imageUrl: string;
        isActive: boolean;
        stock: number;
        vendor: {
            connect: {
                id: string;
            };
        };
        primaryCategory: {
            connect: {
                id: string;
            };
        };
        productCategories: {
            create: {
                category: {
                    connect: {
                        id: string;
                    };
                };
            }[];
        };
    };
}
export {};
