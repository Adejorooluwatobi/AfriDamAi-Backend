import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartEntity } from 'src/domain/entities/cart.entity';
//import { AdminGuard } from '../auth/guards';
import { CreateCartDto } from 'src/application/DTOs/carts/create-cart.dto';
import { CreateCartItemDto } from 'src/application/DTOs/carts/create-cart-item.dto';
import { CartService } from 'src/domain/services/cart.service';
import { UpdateCartItemDto } from 'src/application/DTOs/carts/update-cart-item.dto';

@ApiExtraModels(CreateCartDto, CreateCartItemDto)
@Controller('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  //@UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully', type: CartEntity })
  async create(@Body(new ValidationPipe()) CreateCartDto: CreateCartDto) {
    const cart = await this.cartService.createCart(CreateCartDto.userId);
    if (!cart) {
      throw new InternalServerErrorException('Cart creation failed');
    }
    return {
      succeeded: true,
      message: 'Cart created successfully',
      resultData: cart,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a cart by userID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartEntity })
  async findUser(@Param('id') id: string) {
    const cart = await this.cartService.getCartByUser(id);
    if (!cart) {
      throw new NotFoundException(`Cart with Userid ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Cart retrieved successfully',
      resultData: cart,
    };
  }

  @Put(':id')
  //@UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully', type: CartEntity })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    UpdateCartItemDto: UpdateCartItemDto,
  ) {
    const payload = {
      cartId: UpdateCartItemDto.cartId,
      productId: UpdateCartItemDto.productId,
      quantity: UpdateCartItemDto.quantity,
    };
    const category = await this.cartService.updateItem(id, payload);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Cart updated successfully',
      resultData: category,
    };
  }

  @Post('/addItem/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added from cart successfully', type: CartEntity })
  async addItem(
    @Param('id') userid: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    CreateCartItemDto: CreateCartItemDto,
  ) {
    const cart = await this.cartService.addItem(userid, CreateCartItemDto);
    return {
      succeeded: true,
      message: 'Item added from cart successfully',
      resultData: cart,
    };
  }

  @Delete(':userId/items/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully', type: CartEntity })
  async removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    const cart = await this.cartService.removeItem(userId, productId);
    return {
      succeeded: true,
      message: 'Item removed from cart successfully',
      resultData: cart,
    };
  }

  @Delete(':userId/clear')
  @ApiOperation({ summary: 'Clear all items in the cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully', type: CartEntity })
  async clearCart(@Param('userId') userId: string) {
    const cart = await this.cartService.clearCart(userId);
    return {
      succeeded: true,
      message: 'Cart cleared successfully',
      resultData: cart,
    };
  }
}
