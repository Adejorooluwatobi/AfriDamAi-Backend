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
exports.PrismaOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const order_mapper_1 = require("../../mappers/order.mapper");
let PrismaOrderRepository = class PrismaOrderRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransactional(params) {
        return await this.prisma.$transaction(async (tx) => {
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
            return order_mapper_1.OrderMapper.toDomain(order);
        });
    }
    async findById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                            },
                        },
                    },
                },
            },
        });
        return order ? order_mapper_1.OrderMapper.toDomain(order) : null;
    }
    async findByUserId(userId) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
                user: true,
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map((o) => order_mapper_1.OrderMapper.toDomain(o));
    }
    async findAll() {
        const orders = await this.prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map((o) => order_mapper_1.OrderMapper.toDomain(o));
    }
    async update(id, params) {
        const order = await this.prisma.order.update({
            where: { id },
            data: params,
        });
        return order_mapper_1.OrderMapper.toDomain(order);
    }
    async delete(id) {
        await this.prisma.order.delete({
            where: { id },
        });
    }
    async findPendingOrdersOlderThan(date) {
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
        return orders.map((o) => order_mapper_1.OrderMapper.toDomain(o));
    }
};
exports.PrismaOrderRepository = PrismaOrderRepository;
exports.PrismaOrderRepository = PrismaOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaOrderRepository);
//# sourceMappingURL=prisma-order.repository.js.map