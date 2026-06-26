"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const transaction_controller_1 = require("../controllers/transaction.controller");
const transaction_service_1 = require("../../domain/services/transaction.service");
const prisma_transaction_repository_1 = require("../../infrastructure/persistence/prisma/prisma-transaction.repository");
const shared_module_1 = require("../../shared/shared.module");
const order_module_1 = require("./order.module");
const invoice_module_1 = require("./invoice.module");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_order_repository_1 = require("../../infrastructure/persistence/prisma/prisma-order.repository");
const prisma_product_repository_1 = require("../../infrastructure/persistence/prisma/prisma-product.repository");
const prisma_appointment_repository_1 = require("../../infrastructure/persistence/prisma/prisma-appointment.repository");
const prisma_user_repository_1 = require("../../infrastructure/persistence/prisma/prisma-user.repository");
const paystack_gateway_1 = require("../../infrastructure/payment/gateways/paystack.gateway");
const pricing_plan_module_1 = require("./pricing-plan.module");
const subscription_module_1 = require("./subscription.module");
const webhook_controller_1 = require("../controllers/webhook.controller");
const admin_module_1 = require("./admin.module");
const notification_module_1 = require("./notification.module");
const wallet_module_1 = require("./wallet.module");
let TransactionModule = class TransactionModule {
};
exports.TransactionModule = TransactionModule;
exports.TransactionModule = TransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            shared_module_1.SharedModule,
            order_module_1.OrderModule,
            invoice_module_1.InvoiceModule,
            prisma_module_1.PrismaModule,
            pricing_plan_module_1.PricingPlanModule,
            subscription_module_1.SubscriptionModule,
            admin_module_1.AdminModule,
            notification_module_1.NotificationModule,
            wallet_module_1.WalletModule,
        ],
        controllers: [transaction_controller_1.TransactionController, webhook_controller_1.WebhookController],
        providers: [
            transaction_service_1.TransactionService,
            {
                provide: 'ITransactionRepository',
                useClass: prisma_transaction_repository_1.PrismaTransactionRepository,
            },
            {
                provide: 'IPaymentGateway',
                useClass: paystack_gateway_1.PaystackGateway,
            },
            {
                provide: 'IAppointmentRepository',
                useClass: prisma_appointment_repository_1.PrismaAppointmentRepository,
            },
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: 'IOrderRepository',
                useClass: prisma_order_repository_1.PrismaOrderRepository,
            },
            {
                provide: 'IProductRepository',
                useClass: prisma_product_repository_1.PrismaProductRepository,
            },
        ],
        exports: [
            transaction_service_1.TransactionService,
            'ITransactionRepository',
            'IPaymentGateway'
        ],
    })
], TransactionModule);
//# sourceMappingURL=transaction.module.js.map