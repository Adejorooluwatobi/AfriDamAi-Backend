import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { CartRepositoryInterface } from '../repositories/cart.repository.interface';
import {
  CreateCartItemParams,
} from 'src/utils/type';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async getCartByUser(userId: string): Promise<CartEntity | null> {
    const cart = await this.cartRepository.findCartByUserId(userId);
    return cart;
  }

  async addItem(
    userId: string,
    params: CreateCartItemParams,
  ): Promise<CartEntity | null> {
    await this.cartRepository.addItem(params);
    return this.getCartByUser(userId);
  }

  async updateItem(
    userId: string,
    params: CreateCartItemParams,
  ): Promise<CartEntity| null > {
    const cart =  await this.getCartByUser(userId);
    if(!cart)
    {
      throw new NotFoundException('Cart not found')
    }
    const item = cart.items.find((i) => i.id === params.productId);
    if (!item) throw new NotFoundException('Item not found in your cart');
    await this.cartRepository.updateItem(params);
    return this.getCartByUser(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getCartByUser(userId);

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item not found in your cart');

    await this.cartRepository.removeItem(cart.id, itemId);

    return this.getCartByUser(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCartByUser(userId);
    
    if (cart) {
      await this.cartRepository.clearCart(cart.id);
    }

    return this.getCartByUser(userId);
  }

  async createCart(userId: string): Promise<CartEntity> {
    const existingCart = await this.cartRepository.findCartByUserId(userId);
    if (existingCart) {
      throw new ConflictException(`User Cart has already being created.`);
    }
    const created = await this.cartRepository.createCart(userId);
    this.logger.log(`Cart created (id=${created.id})`);
    return created;
  }
}
