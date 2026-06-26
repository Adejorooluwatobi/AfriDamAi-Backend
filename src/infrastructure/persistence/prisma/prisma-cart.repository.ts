import { Injectable } from '@nestjs/common';
import { CartRepositoryInterface } from 'src/domain/repositories/cart.repository.interface';
import { CartEntity } from 'src/domain/entities/cart.entity';
import { CreateCartItemParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { CartMapper } from 'src/infrastructure/mappers/cart.mapper';

@Injectable()
export class PrismaCartRepository implements CartRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createCart(userId: string): Promise<CartEntity> {
    const cart = await this.prisma.cart.create({
      data: { userId },
    });
    return CartMapper.toDomain(cart);
  }

  async deleteCart(userId: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { userId },
    });
  }

  async findCartByUserId(userId: string): Promise<CartEntity | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    return cart ? CartMapper.toDomain(cart) : null;
  }

  async addItem(params: CreateCartItemParams): Promise<CartEntity> {
    const { cartId, productId, quantity } = params;
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
    let raw;
    if (existingItem) {
      raw = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + params.quantity },
        include: { cart: { include: { items: true } } },
      });
      return CartMapper.toDomain(raw.cart);
    }

    raw = await this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: { cart: { include: { items: true } } },
    });
    return CartMapper.toDomain(raw.cart);
  }

  async updateItem(params: CreateCartItemParams): Promise<CartEntity> {
    const { cartId, productId, quantity } = params;
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (!existingItem) {
      throw new Error('Item not found in cart');
    }

    const raw = await this.prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
      include: { cart: { include: { items: true } } },
    });

    return CartMapper.toDomain(raw.cart);
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (!existingItem) {
      throw new Error('Item not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: existingItem.id },
      include: { cart: { include: { items: true } } },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });
  }
}
