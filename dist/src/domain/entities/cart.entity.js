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
exports.CartEntity = void 0;
const cart_item_entity_1 = require("./cart-item.entity");
const swagger_1 = require("@nestjs/swagger");
class CartEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    addItem(productId, quantity = 1) {
        const existing = this.items.find((i) => i.productId === productId);
        if (existing) {
            existing.quantity += quantity;
            return existing;
        }
        const newItem = new cart_item_entity_1.CartItemEntity({
            productId,
            quantity,
            cartId: this.id,
        });
        this.items.push(newItem);
        return newItem;
    }
    updateQuantity(productId, quantity) {
        const existing = this.items.find((i) => i.productId === productId);
        if (!existing)
            throw new Error('Item not in cart.');
        if (quantity <= 0) {
            this.items = this.items.filter((i) => i.productId !== productId);
        }
        else {
            existing.quantity = quantity;
        }
    }
    removeItem(productId) {
        this.items = this.items.filter((i) => i.productId !== productId);
    }
    clear() {
        this.items = [];
    }
}
exports.CartEntity = CartEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CartEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CartEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [cart_item_entity_1.CartItemEntity] }),
    __metadata("design:type", Array)
], CartEntity.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CartEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CartEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=cart.entity.js.map