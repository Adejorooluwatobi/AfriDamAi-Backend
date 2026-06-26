export interface CategoryResponseDto {
    id: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
    parentName?: string | null;
    createdAt: Date;
}
