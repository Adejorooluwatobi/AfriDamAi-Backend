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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
let CartService = CartService_1 = class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.logger = new common_1.Logger(CartService_1.name);
    }
    async getCartByUser(userId) {
        const cart = await this.cartRepository.findCartByUserId(userId);
        return cart;
    }
    async addItem(userId, params) {
        await this.cartRepository.addItem(params);
        return this.getCartByUser(userId);
    }
    async updateItem(userId, params) {
        const cart = await this.getCartByUser(userId);
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const item = cart.items.find((i) => i.id === params.productId);
        if (!item)
            throw new common_1.NotFoundException('Item not found in your cart');
        await this.cartRepository.updateItem(params);
        return this.getCartByUser(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getCartByUser(userId);
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item not found in your cart');
        await this.cartRepository.removeItem(cart.id, itemId);
        return this.getCartByUser(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCartByUser(userId);
        if (cart) {
            await this.cartRepository.clearCart(cart.id);
        }
        return this.getCartByUser(userId);
    }
    async createCart(userId) {
        const existingCart = await this.cartRepository.findCartByUserId(userId);
        if (existingCart) {
            throw new common_1.ConflictException(`User Cart has already being created.`);
        }
        const created = await this.cartRepository.createCart(userId);
        this.logger.log(`Cart created (id=${created.id})`);
        return created;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CartRepository')),
    __metadata("design:paramtypes", [Object])
], CartService);
//# sourceMappingURL=cart.service.js.map