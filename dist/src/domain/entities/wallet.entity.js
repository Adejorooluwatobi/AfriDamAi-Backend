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
exports.Wallet = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const wallet_transaction_entity_1 = require("./wallet-transaction.entity");
const withdrawal_request_entity_1 = require("./withdrawal-request.entity");
class Wallet {
    constructor(partial) {
        Object.assign(this, partial);
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = this.updatedAt || new Date();
    }
}
exports.Wallet = Wallet;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Wallet.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WalletOwnerType }),
    __metadata("design:type", String)
], Wallet.prototype, "ownerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount credited to the wallet' }),
    __metadata("design:type", Number)
], Wallet.prototype, "totalIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount debited from the wallet' }),
    __metadata("design:type", Number)
], Wallet.prototype, "totalOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Wallet.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [wallet_transaction_entity_1.WalletTransactionEntity], required: false }),
    __metadata("design:type", Array)
], Wallet.prototype, "transactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [withdrawal_request_entity_1.WithdrawalRequestEntity], required: false }),
    __metadata("design:type", Array)
], Wallet.prototype, "withdrawalRequests", void 0);
//# sourceMappingURL=wallet.entity.js.map