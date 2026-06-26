import { ReviewRepositoryInterface } from 'src/domain/repositories/review.repository.interface';
import { ReviewEntity } from 'src/domain/entities/review.entity';
import { CreateReviewParams, UpdateReviewParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaReviewRepository implements ReviewRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateReviewParams): Promise<ReviewEntity>;
    findById(id: string): Promise<ReviewEntity | null>;
    findByProductId(productId: string): Promise<ReviewEntity[]>;
    findByUserId(userId: string): Promise<ReviewEntity[]>;
    update(id: string, params: UpdateReviewParams): Promise<ReviewEntity>;
    delete(id: string): Promise<void>;
}
