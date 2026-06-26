"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMapper = void 0;
const review_entity_1 = require("../../domain/entities/review.entity");
class ReviewMapper {
    static toDomain(prismaReview) {
        return new review_entity_1.ReviewEntity({
            id: prismaReview.id,
            userId: prismaReview.userId,
            productId: prismaReview.productId,
            rating: prismaReview.rating,
            comment: prismaReview.comment ?? undefined,
            createdAt: prismaReview.createdAt,
            updatedAt: prismaReview.updatedAt,
        });
    }
    static toPrisma(review) {
        return {
            id: review.id,
            userId: review.userId,
            productId: review.productId,
            rating: review.rating,
            comment: review.comment ?? null,
        };
    }
}
exports.ReviewMapper = ReviewMapper;
//# sourceMappingURL=review.mapper.js.map