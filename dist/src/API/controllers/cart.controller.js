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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_entity_1 = require("../../domain/entities/cart.entity");
const create_cart_dto_1 = require("../../application/DTOs/carts/create-cart.dto");
const create_cart_item_dto_1 = require("../../application/DTOs/carts/create-cart-item.dto");
const cart_service_1 = require("../../domain/services/cart.service");
const update_cart_item_dto_1 = require("../../application/DTOs/carts/update-cart-item.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async create(CreateCartDto) {
        const cart = await this.cartService.createCart(CreateCartDto.userId);
        if (!cart) {
            throw new common_1.InternalServerErrorException('Cart creation failed');
        }
        return {
            succeeded: true,
            message: 'Cart created successfully',
            resultData: cart,
        };
    }
    async findUser(id) {
        const cart = await this.cartService.getCartByUser(id);
        if (!cart) {
            throw new common_1.NotFoundException(`Cart with Userid ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Cart retrieved successfully',
            resultData: cart,
        };
    }
    async update(id, UpdateCartItemDto) {
        const payload = {
            cartId: UpdateCartItemDto.cartId,
            productId: UpdateCartItemDto.productId,
            quantity: UpdateCartItemDto.quantity,
        };
        const category = await this.cartService.updateItem(id, payload);
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Cart updated successfully',
            resultData: category,
        };
    }
    async addItem(userid, CreateCartItemDto) {
        const cart = await this.cartService.addItem(userid, CreateCartItemDto);
        return {
            succeeded: true,
            message: 'Item added from cart successfully',
            resultData: cart,
        };
    }
    async removeItem(userId, productId) {
        const cart = await this.cartService.removeItem(userId, productId);
        return {
            succeeded: true,
            message: 'Item removed from cart successfully',
            resultData: cart,
        };
    }
    async clearCart(userId) {
        const cart = await this.cartService.clearCart(userId);
        return {
            succeeded: true,
            message: 'Cart cleared successfully',
            resultData: cart,
        };
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cart created successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a cart by userID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "findUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a cart by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart updated successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('/addItem/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item added from cart successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cart_item_dto_1.CreateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':userId/items/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an item from the cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from cart successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(':userId/clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all items in the cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared successfully', type: cart_entity_1.CartEntity }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_cart_dto_1.CreateCartDto, create_cart_item_dto_1.CreateCartItemDto),
    (0, common_1.Controller)('Cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map