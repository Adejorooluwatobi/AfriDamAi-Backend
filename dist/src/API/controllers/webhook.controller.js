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
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transaction_service_1 = require("../../domain/services/transaction.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    async handlePaystackWebhook(payload, signature) {
        this.logger.log(`Paystack Webhook Received: ${payload.event}`);
        return this.transactionService.handlePaystackWebhook(payload, signature);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('paystack'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Paystack Webhooks' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handlePaystackWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map