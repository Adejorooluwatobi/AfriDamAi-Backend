export declare class CategoryEntity {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    description?: string | null;
    children?: CategoryEntity[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CategoryEntity>);
}
