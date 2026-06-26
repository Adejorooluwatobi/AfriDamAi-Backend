import { Injectable } from "@nestjs/common";
import { OrderRepositoryInterface } from "src/domain/repositories/order.repository.interface";
import { PrismaService } from "./prisma.service";
import { OrderEntity } from "src/domain/entities/order.entity";
import { CreateOrderParams, UpdateOrderParams } from "src/utils/type";
import { OrderMapper } from "src/infrastructure/mappers/order.mapper";

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createTransactional(params: CreateOrderParams): Promise<OrderEntity> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Create the Order and OrderItems
      const order = await tx.order.create({
        data: {
          userId: params.userId,
          totalAmount: params.totalAmount,
          shippingAddress: params.shippingAddress,
          items: {
            create: params.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 2. Decrement stock for each product
      for (const item of params.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return OrderMapper.toDomain(order as any);
    });
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true, // Include user information
        items: {
          include: {
            product: {
              include: {
                vendor: true, // Include vendor information
              },
            },
          },
        },
      },
    });
    return order ? OrderMapper.toDomain(order as any) : null;
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                vendor: true, // Include vendor information
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => OrderMapper.toDomain(o as any));
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                vendor: true, // Include vendor information
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => OrderMapper.toDomain(o as any));
  }

  async update(id: string, params: UpdateOrderParams): Promise<OrderEntity> {
    const order = await this.prisma.order.update({
      where: { id },
      data: params,
    });
    return OrderMapper.toDomain(order);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  async findPendingOrdersOlderThan(date: Date): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: date,
        },
      },
      include: {
        items: true,
      },
    });
    return orders.map((o) => OrderMapper.toDomain(o as any));
  }
}