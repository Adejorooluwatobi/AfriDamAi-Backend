import { WishlistRepositoryInterface } from 'src/domain/repositories/wishlist.repository.interface';
import { WishlistEntity } from 'src/domain/entities/wishlist.entity';
import { CreateWishlistParams, CreateWishlistItemParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaWishlistRepository implements WishlistRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    create(params: CreateWishlistParams): Promise<WishlistEntity>;
    findByUserId(userId: string): Promise<WishlistEntity | null>;
    findById(id: string): Promise<WishlistEntity | null>;
    addItem(params: CreateWishlistItemParams): Promise<WishlistEntity>;
    removeItem(params: CreateWishlistItemParams): Promise<WishlistEntity>;
    clear(wishlistId: string): Promise<void>;
}
