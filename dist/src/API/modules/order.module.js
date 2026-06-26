"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_controller_1 = require("../controllers/order.controller");
const order_service_1 = require("../../domain/services/order.service");
const prisma_order_repository_1 = require("../../infrastructure/persistence/prisma/prisma-order.repository");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const product_module_1 = require("./product.module");
const cart_module_1 = require("./cart.module");
const product_attribute_module_1 = require("./product-attribute.module");
const shared_module_1 = require("../../shared/shared.module");
const notification_module_1 = require("./notification.module");
const admin_module_1 = require("./admin.module");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, product_module_1.ProductModule, cart_module_1.CartModule, product_attribute_module_1.ProductAttributeModule, shared_module_1.SharedModule, notification_module_1.NotificationModule, admin_module_1.AdminModule],
        controllers: [order_controller_1.OrderController],
        providers: [
            order_service_1.OrderService,
            {
                provide: 'IOrderRepository',
                useClass: prisma_order_repository_1.PrismaOrderRepository,
            },
        ],
        exports: [order_service_1.OrderService, 'IOrderRepository'],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map