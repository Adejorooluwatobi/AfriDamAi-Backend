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
exports.WishlistItemEntity = void 0;
const product_entity_1 = require("./product.entity");
const swagger_1 = require("@nestjs/swagger");
class WishlistItemEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.WishlistItemEntity = WishlistItemEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemEntity.prototype, "wishlistId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemEntity.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => product_entity_1.ProductEntity, required: false }),
    __metadata("design:type", product_entity_1.ProductEntity)
], WishlistItemEntity.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WishlistItemEntity.prototype, "createdAt", void 0);
//# sourceMappingURL=wishlist-item.entity.js.map