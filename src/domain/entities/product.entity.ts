import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';
import { VendorEntity } from './vendor.entity'; // Import VendorEntity
import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  basePrice: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  primaryCategory?: {
    id: string;
    name: string;
  } | null;

  @ApiProperty({ required: false })
  secondaryCategories?: {
    id: string;
    name: string;
  }[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  stock: number;

  @ApiProperty({ type: [ReviewEntity], required: false })
  reviews?: ReviewEntity[];

  @ApiProperty({ required: false })
  averageRating?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  vendorId?: string; // Changed to non-nullable string

  @ApiProperty({ type: () => VendorEntity, required: false, nullable: true }) // Changed type to VendorEntity
  vendor?: VendorEntity | null;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
    this.isActive = partial?.isActive ?? true;
    this.description = partial?.description ?? null;
    this.stock = partial?.stock ?? 0;
    this.primaryCategory = partial.primaryCategory ?? null;
    this.secondaryCategories = partial.secondaryCategories ?? [];
  }
}
