"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const review_mapper_1 = require("../../mappers/review.mapper");
let PrismaReviewRepository = class PrismaReviewRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const review = await this.prisma.review.create({
            data: params,
        });
        return review_mapper_1.ReviewMapper.toDomain(review);
    }
    async findById(id) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        return review ? review_mapper_1.ReviewMapper.toDomain(review) : null;
    }
    async findByProductId(productId) {
        const reviews = await this.prisma.review.findMany({
            where: { productId },
        });
        return reviews.map(review_mapper_1.ReviewMapper.toDomain);
    }
    async findByUserId(userId) {
        const reviews = await this.prisma.review.findMany({
            where: { userId },
        });
        return reviews.map(review_mapper_1.ReviewMapper.toDomain);
    }
    async update(id, params) {
        const review = await this.prisma.review.update({
            where: { id },
            data: params,
        });
        return review_mapper_1.ReviewMapper.toDomain(review);
    }
    async delete(id) {
        await this.prisma.review.delete({
            where: { id },
        });
    }
};
exports.PrismaReviewRepository = PrismaReviewRepository;
exports.PrismaReviewRepository = PrismaReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaReviewRepository);
//# sourceMappingURL=prisma-review.repository.js.map