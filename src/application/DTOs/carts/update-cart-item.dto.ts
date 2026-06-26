import { IsNotEmpty, IsNumber, IsString, Min,  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'ID of the cart containing the item' })
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @ApiProperty({ description: 'ID of the product to update in the cart' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'New quantity for the product', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
