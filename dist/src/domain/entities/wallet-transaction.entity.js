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
exports.WalletTransactionEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const wallet_entity_1 = require("./wallet.entity");
class WalletTransactionEntity {
    constructor(partial) {
        Object.assign(this, partial);
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = this.updatedAt || new Date();
    }
}
exports.WalletTransactionEntity = WalletTransactionEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => wallet_entity_1.Wallet }),
    __metadata("design:type", wallet_entity_1.Wallet)
], WalletTransactionEntity.prototype, "wallet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WalletTransactionType }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WalletTransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "relatedEntityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WalletRelatedEntityType, required: false }),
    __metadata("design:type", String)
], WalletTransactionEntity.prototype, "relatedEntityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WalletTransactionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WalletTransactionEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=wallet-transaction.entity.js.map