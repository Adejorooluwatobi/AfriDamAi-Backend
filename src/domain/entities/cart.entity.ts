import { CartItemEntity } from './cart-item.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CartEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [CartItemEntity] })
  items: CartItemEntity[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<CartEntity>) {
    Object.assign(this, partial);
  }

  addItem(productId: string, quantity: number = 1) {
    const existing = this.items.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      return existing;
    }

    const newItem = new CartItemEntity({
      productId,
      quantity,
      cartId: this.id,
    });

    this.items.push(newItem);
    return newItem;
  }

  updateQuantity(productId: string, quantity: number) {
    const existing = this.items.find((i) => i.productId === productId);
    if (!existing) throw new Error('Item not in cart.');

    if (quantity <= 0) {
      this.items = this.items.filter((i) => i.productId !== productId);
    } else {
      existing.quantity = quantity;
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  clear() {
    this.items = [];
  }
}
