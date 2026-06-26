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
exports.WithdrawalRequestEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const wallet_entity_1 = require("./wallet.entity");
class WithdrawalRequestEntity {
    constructor(partial) {
        Object.assign(this, partial);
        this.requestedAt = this.requestedAt || new Date();
    }
}
exports.WithdrawalRequestEntity = WithdrawalRequestEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => wallet_entity_1.Wallet }),
    __metadata("design:type", wallet_entity_1.Wallet)
], WithdrawalRequestEntity.prototype, "wallet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WithdrawalRequestEntity.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WithdrawalStatus }),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "requestedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WalletOwnerType }),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "requestedByType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "approvedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WithdrawalRequestEntity.prototype, "requestedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], WithdrawalRequestEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], WithdrawalRequestEntity.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], WithdrawalRequestEntity.prototype, "adminNotes", void 0);
//# sourceMappingURL=withdrawal-request.entity.js.map