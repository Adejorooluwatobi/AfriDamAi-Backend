import { ProductEntity } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cartId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: () => ProductEntity, required: false })
  product?: ProductEntity;

  constructor(partial: Partial<CartItemEntity>) {
    Object.assign(this, partial);
    this.quantity = partial.quantity ?? 1;
  }
}
