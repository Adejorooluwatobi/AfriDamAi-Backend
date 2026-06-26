import { Injectable } from '@nestjs/common';
import { ReviewRepositoryInterface } from 'src/domain/repositories/review.repository.interface';
import { ReviewEntity } from 'src/domain/entities/review.entity';
import { CreateReviewParams, UpdateReviewParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { ReviewMapper } from 'src/infrastructure/mappers/review.mapper';

@Injectable()
export class PrismaReviewRepository implements ReviewRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateReviewParams): Promise<ReviewEntity> {
        const review = await this.prisma.review.create({
            data: params,
        });
        return ReviewMapper.toDomain(review);
    }

    async findById(id: string): Promise<ReviewEntity | null> {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        return review ? ReviewMapper.toDomain(review) : null;
    }

    async findByProductId(productId: string): Promise<ReviewEntity[]> {
        const reviews = await this.prisma.review.findMany({
            where: { productId },
        });
        return reviews.map(ReviewMapper.toDomain);
    }

    async findByUserId(userId: string): Promise<ReviewEntity[]> {
        const reviews = await this.prisma.review.findMany({
            where: { userId },
        });
        return reviews.map(ReviewMapper.toDomain);
    }

    async update(id: string, params: UpdateReviewParams): Promise<ReviewEntity> {
        const review = await this.prisma.review.update({
            where: { id },
            data: params,
        });
        return ReviewMapper.toDomain(review);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.review.delete({
            where: { id },
        });
    }
}