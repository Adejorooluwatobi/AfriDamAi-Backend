"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupModule = void 0;
const common_1 = require("@nestjs/common");
const cleanup_service_1 = require("../../domain/services/cleanup.service");
const order_module_1 = require("./order.module");
const transaction_module_1 = require("./transaction.module");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
let CleanupModule = class CleanupModule {
};
exports.CleanupModule = CleanupModule;
exports.CleanupModule = CleanupModule = __decorate([
    (0, common_1.Module)({
        imports: [order_module_1.OrderModule, transaction_module_1.TransactionModule, prisma_module_1.PrismaModule],
        providers: [cleanup_service_1.CleanupService],
    })
], CleanupModule);
//# sourceMappingURL=cleanup.module.js.map