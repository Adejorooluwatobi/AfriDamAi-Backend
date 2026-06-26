import { ReviewEntity } from 'src/domain/entities/review.entity';
import { Review } from '@prisma/client';
export declare class ReviewMapper {
    static toDomain(prismaReview: Review): ReviewEntity;
    static toPrisma(review: ReviewEntity): Omit<Review, 'createdAt' | 'updatedAt'>;
}
