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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
let WishlistService = class WishlistService {
    constructor(wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }
    async createWishlist(wishlistDetails, userId, userType) {
        const existingWishlist = await this.wishlistRepository.findByUserId(userId);
        if (existingWishlist) {
            throw new common_1.ConflictException(`Wishlist already exists for this user`);
        }
        const wishlistCreateData = { userId };
        if (userType === 'user')
            wishlistCreateData.userId = userId;
        const wishlist = await this.wishlistRepository.create(wishlistCreateData);
        return wishlist;
    }
    async getWishlistByUserId(userId) {
        const existingWishlist = await this.wishlistRepository.findByUserId(userId);
        return existingWishlist || null;
    }
    async getWishlistById(id, userId) {
        const wishlist = await this.wishlistRepository.findById(id);
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist not found`);
        }
        if (wishlist.userId !== userId) {
            throw new common_1.NotFoundException(`Wishlist not found`);
        }
        return wishlist;
    }
    async addItemToWishlist(productParams, userId) {
        let wishlist = await this.wishlistRepository.findByUserId(userId);
        if (!wishlist) {
            wishlist = await this.wishlistRepository.create({ userId });
        }
        const updatedWishlist = await this.wishlistRepository.addItem({
            wishlistId: wishlist.id,
            productId: productParams.productId,
        });
        return updatedWishlist;
    }
    async removeItemFromWishlist(productParams, userId) {
        const wishlist = await this.wishlistRepository.findByUserId(userId);
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist does not exist for this user`);
        }
        const updatedWishlist = await this.wishlistRepository.removeItem({
            wishlistId: wishlist.id,
            productId: productParams.productId,
        });
        return updatedWishlist;
    }
    async clearWishlist(wishlistId) {
        await this.wishlistRepository.clear(wishlistId);
        return;
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IWishlistRepository')),
    __metadata("design:paramtypes", [Object])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map