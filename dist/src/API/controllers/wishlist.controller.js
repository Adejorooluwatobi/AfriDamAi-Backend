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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const wishlist_service_1 = require("../../domain/services/wishlist.service");
const create_wishlist_item_dto_1 = require("../../application/DTOs/wishlists/create-wishlist-item.dto");
const wishlist_response_dto_1 = require("../../application/DTOs/wishlists/wishlist-response.dto");
const wishlist_response_mapper_1 = require("../../infrastructure/mappers/wishlist-response.mapper");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    async create(req) {
        const userInfo = this.extractUserId(req.user);
        const wishlist = await this.wishlistService.createWishlist({ userId: userInfo.id }, userInfo.id, userInfo.type);
        return {
            succeeded: true,
            message: 'Wishlist created successfully',
            resultData: wishlist_response_mapper_1.WishlistResponseMapper.toResponseDto(wishlist)
        };
    }
    async getMyWishlist(req) {
        const userInfo = this.extractUserId(req.user);
        const wishlist = await this.wishlistService.getWishlistByUserId(userInfo.id);
        if (!wishlist) {
            return {
                succeeded: true,
                message: 'You do not have a wishlist yet',
                resultData: {
                    id: null,
                    userId: userInfo.id,
                    items: [],
                    totalItems: 0,
                    createdAt: null,
                    updatedAt: null
                }
            };
        }
        return {
            succeeded: true,
            message: 'Wishlist retrieved successfully',
            resultData: wishlist_response_mapper_1.WishlistResponseMapper.toResponseDto(wishlist)
        };
    }
    async getWishlist(id, req) {
        const userInfo = this.extractUserId(req.user);
        const wishlist = await this.wishlistService.getWishlistById(id, userInfo.id);
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }
        return {
            succeeded: true,
            message: 'Wishlist retrieved successfully',
            resultData: wishlist_response_mapper_1.WishlistResponseMapper.toResponseDto(wishlist)
        };
    }
    async addItem(productId, dto, req) {
        const userInfo = this.extractUserId(req.user);
        const updatedWishlist = await this.wishlistService.addItemToWishlist({
            productId: productId,
        }, userInfo.id);
        return {
            succeeded: true,
            message: 'Item added to wishlist successfully',
            resultData: wishlist_response_mapper_1.WishlistResponseMapper.toResponseDto(updatedWishlist)
        };
    }
    async removeItem(productId, dto, req) {
        const userInfo = this.extractUserId(req.user);
        const updatedWishlist = await this.wishlistService.removeItemFromWishlist({
            productId: productId,
        }, userInfo.id);
        return {
            succeeded: true,
            message: 'Item removed from wishlist successfully',
            resultData: wishlist_response_mapper_1.WishlistResponseMapper.toResponseDto(updatedWishlist)
        };
    }
    async clearWishlist(id, req) {
        const userInfo = this.extractUserId(req.user);
        const wishlist = await this.wishlistService.getWishlistById(id, userInfo.id);
        if (!wishlist) {
            return {
                succeeded: false,
                message: 'Wishlist not found',
                resultData: null
            };
        }
        await this.wishlistService.clearWishlist(id);
        return {
            succeeded: true,
            message: 'Wishlist cleared successfully',
            resultData: {
                id,
                items: [],
                totalItems: 0
            }
        };
    }
    extractUserId(user) {
        const userObj = user;
        if (userObj.user) {
            const userSubObj = userObj.user;
            if (userSubObj.id) {
                return { id: userSubObj.id, type: 'user' };
            }
        }
        throw new Error('User ID not found in token');
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new wishlist for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wishlist created successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my wishlist with all items and product details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wishlist retrieved successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getMyWishlist", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist by ID (only owner can access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Wishlist ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wishlist retrieved successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Put)(':id/additem'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to wishlist' }),
    (0, swagger_1.ApiBody)({ type: create_wishlist_item_dto_1.CreateWishlistItemDto }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item added to wishlist successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_wishlist_item_dto_1.CreateWishlistItemDto, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)(':id/removeitem'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from wishlist' }),
    (0, swagger_1.ApiBody)({ type: create_wishlist_item_dto_1.CreateWishlistItemDto }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from wishlist successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_wishlist_item_dto_1.CreateWishlistItemDto, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(':id/clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all items from wishlist' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Wishlist ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wishlist cleared successfully', type: wishlist_response_dto_1.WishlistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "clearWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('Wishlist'),
    (0, common_1.Controller)('wishlist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map