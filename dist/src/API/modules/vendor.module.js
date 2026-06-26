"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const vendor_controller_1 = require("../controllers/vendor.controller");
const vendor_service_1 = require("../../domain/services/vendor.service");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_vendor_repository_1 = require("../../infrastructure/persistence/prisma/prisma-vendor.repository");
const wallet_module_1 = require("./wallet.module");
let VendorModule = class VendorModule {
};
exports.VendorModule = VendorModule;
exports.VendorModule = VendorModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, passport_1.PassportModule, jwt_1.JwtModule.register({}), (0, common_1.forwardRef)(() => wallet_module_1.WalletModule)],
        controllers: [vendor_controller_1.VendorController],
        providers: [
            vendor_service_1.VendorService,
            {
                provide: 'IVendorRepository',
                useClass: prisma_vendor_repository_1.PrismaVendorRepository,
            },
        ],
        exports: [vendor_service_1.VendorService, 'IVendorRepository'],
    })
], VendorModule);
//# sourceMappingURL=vendor.module.js.map