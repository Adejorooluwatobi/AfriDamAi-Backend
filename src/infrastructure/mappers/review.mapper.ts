import { ReviewEntity } from 'src/domain/entities/review.entity';
import { Review } from '@prisma/client';

export class ReviewMapper {
    static toDomain(prismaReview: Review): ReviewEntity {
        return new ReviewEntity({
            id: prismaReview.id,
            userId: prismaReview.userId,
            productId: prismaReview.productId,
            rating: prismaReview.rating,
            comment: prismaReview.comment ?? undefined,
            createdAt: prismaReview.createdAt,
            updatedAt: prismaReview.updatedAt,
        });
    }

    static toPrisma(review: ReviewEntity): Omit<Review, 'createdAt' | 'updatedAt'> {
        return {
            id: review.id,
            userId: review.userId,
            productId: review.productId,
            rating: review.rating,
            comment: review.comment ?? null,
        };
    }
}