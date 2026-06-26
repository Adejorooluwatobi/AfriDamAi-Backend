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
var PaystackGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackGateway = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const environment_service_1 = require("../../../shared/services/environment.service");
let PaystackGateway = PaystackGateway_1 = class PaystackGateway {
    constructor(httpService, envService) {
        this.httpService = httpService;
        this.envService = envService;
        this.logger = new common_1.Logger(PaystackGateway_1.name);
        this.baseUrl = 'https://api.paystack.co';
    }
    async initializePayment(email, amount, metadata, plan = '') {
        const amountInBaseUnit = Math.round(amount * 100);
        const reference = `AFRIDAM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const body = {
            email,
            amount: amountInBaseUnit,
            reference,
            currency: "NGN",
            callback_url: `${this.envService.frontendUrl}/payment-success`,
            metadata: {
                ...metadata,
                custom_fields: [
                    {
                        display_name: "Service Provider",
                        variable_name: "service_provider",
                        value: "AfriDam AI Clinical Hub"
                    }
                ]
            },
        };
        if (plan) {
            body.plan = plan;
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/transaction/initialize`, body, {
                headers: {
                    Authorization: `Bearer ${this.envService.paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
            }));
            return {
                reference,
                authorizationUrl: response.data.data.authorization_url,
            };
        }
        catch (error) {
            this.logger.error('Paystack Initialization Failed', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('We could not connect to the payment processor. Please try again.');
        }
    }
    async verifyPayment(reference) {
        try {
            this.logger.log(`Verifying Paystack Transaction: ${reference}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.envService.paystackSecretKey}`,
                },
            }));
            const data = response.data.data;
            const status = data.status;
            let resultStatus;
            if (status === 'success') {
                resultStatus = 'COMPLETED';
            }
            else if (status === 'failed' || status === 'abandoned') {
                resultStatus = 'FAILED';
                this.logger.warn(`Transaction not successful: ${reference} - Status: ${status}`);
            }
            else {
                resultStatus = 'PENDING';
                this.logger.log(`Transaction is pending: ${reference} - Status: ${status}`);
            }
            return {
                status: resultStatus,
                gatewayTransactionId: String(data.id),
                amount: data.amount / 100,
                currency: data.currency,
            };
        }
        catch (error) {
            this.logger.error('Paystack Verification Failed', error.response?.data || error.message);
            return {
                status: 'FAILED',
                gatewayTransactionId: '',
                amount: 0,
                currency: 'USD'
            };
        }
    }
};
exports.PaystackGateway = PaystackGateway;
exports.PaystackGateway = PaystackGateway = PaystackGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        environment_service_1.EnvironmentService])
], PaystackGateway);
//# sourceMappingURL=paystack.gateway.js.map