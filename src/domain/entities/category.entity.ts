import { ApiProperty } from "@nestjs/swagger";

export class CategoryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false, nullable: true })
  parentId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ type: () => [CategoryEntity], required: false })
  children?: CategoryEntity[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
    this.isActive = partial.isActive ?? true;
    this.description = partial.description ?? null;
  }
}
