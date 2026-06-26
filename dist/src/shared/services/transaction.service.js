"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor() {
        this.logger = new common_1.Logger(TransactionService_1.name);
    }
    async executeInTransaction(operation) {
        this.logger.debug('Starting transaction');
        try {
            const result = await operation();
            this.logger.debug('Transaction completed successfully');
            return result;
        }
        catch (error) {
            this.logger.error('Transaction failed, rolling back', error);
            throw error;
        }
    }
    async createOrderWithTransaction(_orderData, _paymentData) {
        return this.executeInTransaction(async () => {
            this.logger.log('Order creation with transaction started');
            return { orderId: 'temp-order-id', status: 'pending' };
        });
    }
    async reserveInventory(productId, quantity) {
        this.logger.log(`Reserving ${quantity} units of product ${productId}`);
        return true;
    }
    async releaseInventory(productId, quantity) {
        this.logger.log(`Releasing ${quantity} units of product ${productId}`);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)()
], TransactionService);
//# sourceMappingURL=transaction.service.js.map