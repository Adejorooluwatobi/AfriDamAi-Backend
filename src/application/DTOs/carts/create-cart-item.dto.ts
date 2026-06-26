import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
   @ApiProperty({ description: 'ID of the user owning the cart' })
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({ description: 'ID of the product to add' })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product', minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
