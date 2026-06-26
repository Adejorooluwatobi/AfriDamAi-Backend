import { ReviewEntity } from '../entities/review.entity';
import { CreateReviewParams, UpdateReviewParams } from 'src/utils/type';

export interface ReviewRepositoryInterface {
    create(params: CreateReviewParams): Promise<ReviewEntity>;
    findById(id: string): Promise<ReviewEntity | null>;
    findByProductId(productId: string): Promise<ReviewEntity[]>;
    findByUserId(userId: string): Promise<ReviewEntity[]>;
    update(id: string, params: UpdateReviewParams): Promise<ReviewEntity>;
    delete(id: string): Promise<void>;
}