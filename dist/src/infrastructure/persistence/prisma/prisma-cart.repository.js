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
exports.PrismaCartRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const cart_mapper_1 = require("../../mappers/cart.mapper");
let PrismaCartRepository = class PrismaCartRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCart(userId) {
        const cart = await this.prisma.cart.create({
            data: { userId },
        });
        return cart_mapper_1.CartMapper.toDomain(cart);
    }
    async deleteCart(userId) {
        await this.prisma.cart.delete({
            where: { userId },
        });
    }
    async findCartByUserId(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });
        return cart ? cart_mapper_1.CartMapper.toDomain(cart) : null;
    }
    async addItem(params) {
        const { cartId, productId, quantity } = params;
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId, productId },
        });
        let raw;
        if (existingItem) {
            raw = await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + params.quantity },
                include: { cart: { include: { items: true } } },
            });
            return cart_mapper_1.CartMapper.toDomain(raw.cart);
        }
        raw = await this.prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
            },
            include: { cart: { include: { items: true } } },
        });
        return cart_mapper_1.CartMapper.toDomain(raw.cart);
    }
    async updateItem(params) {
        const { cartId, productId, quantity } = params;
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId, productId },
        });
        if (!existingItem) {
            throw new Error('Item not found in cart');
        }
        const raw = await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity },
            include: { cart: { include: { items: true } } },
        });
        return cart_mapper_1.CartMapper.toDomain(raw.cart);
    }
    async removeItem(cartId, productId) {
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId, productId },
        });
        if (!existingItem) {
            throw new Error('Item not found in cart');
        }
        await this.prisma.cartItem.delete({
            where: { id: existingItem.id },
            include: { cart: { include: { items: true } } },
        });
    }
    async clearCart(cartId) {
        await this.prisma.cartItem.deleteMany({
            where: { cartId },
        });
        await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: { items: { include: { product: true } } },
        });
    }
};
exports.PrismaCartRepository = PrismaCartRepository;
exports.PrismaCartRepository = PrismaCartRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCartRepository);
//# sourceMappingURL=prisma-cart.repository.js.map