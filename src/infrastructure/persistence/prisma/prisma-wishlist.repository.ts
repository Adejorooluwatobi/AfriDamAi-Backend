import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepositoryInterface } from 'src/domain/repositories/wishlist.repository.interface';
import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { CreateWishlistParams, CreateWishlistItemParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { WishlistItemMapper } from 'src/infrastructure/mappers/wishlist-item.mapper';
import { WishlistItem, Product } from '@prisma/client';

type WishlistItemWithProduct = WishlistItem & {
    product: Product;
};

@Injectable()
export class PrismaWishlistRepository implements WishlistRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    private mapToDomain(wishlist: Record<string, unknown>): WishlistEntity {
        const items = ((wishlist.items as WishlistItemWithProduct[]) || []).map((i) => WishlistItemMapper.toDomain(i));
        return new WishlistEntity({
            id: wishlist.id as string,
            userId: wishlist.userId as string,
            createdAt: wishlist.createdAt as Date,
            updatedAt: wishlist.updatedAt as Date,
            items,
        });
    }

    async create(params: CreateWishlistParams): Promise<WishlistEntity> {
        const wishlist = await this.prisma.wishlist.create({
            data: params,
            include: { items: true },
        });
        return this.mapToDomain(wishlist);
    }

    async findByUserId(userId: string): Promise<WishlistEntity | null> {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
            include: { 
                items: {
                    include: { product: true }
                }
            },
        });
        if (!wishlist) return null;
        return this.mapToDomain(wishlist);
    }

    async findById(id: string): Promise<WishlistEntity | null> {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { id },
            include: { 
                items: {
                    include: { product: true }
                }
            },
        });
        if (!wishlist) return null;
        return this.mapToDomain(wishlist);
    }

    async addItem(params: CreateWishlistItemParams): Promise<WishlistEntity> {
        // Create the wishlist item
        await this.prisma.wishlistItem.create({ data: params });
        // Return the updated wishlist with items
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { id: params.wishlistId },
            include: { 
                items: {
                    include: { product: true }
                }
            },
        });
        if (!wishlist) throw new NotFoundException('Wishlist not found');
        return this.mapToDomain(wishlist);
    }

    async removeItem(params: CreateWishlistItemParams): Promise<WishlistEntity> {
        // Remove the wishlist item by wishlistId + productId
        await this.prisma.wishlistItem.deleteMany({
            where: { wishlistId: params.wishlistId, productId: params.productId },
        });
        // Return updated wishlist
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { id: params.wishlistId },
            include: { 
                items: {
                    include: { product: true }
                }
            },
        });
        if (!wishlist) throw new NotFoundException('Wishlist not found');
        return this.mapToDomain(wishlist);
    }

    async clear(wishlistId: string): Promise<void> {
        await this.prisma.wishlistItem.deleteMany({
            where: { wishlistId },
        });
    }
}