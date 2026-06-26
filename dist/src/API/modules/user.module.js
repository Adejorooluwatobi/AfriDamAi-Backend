"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_user_repository_1 = require("../../infrastructure/persistence/prisma/prisma-user.repository");
const user_service_1 = require("../../domain/services/user.service");
const user_controller_1 = require("../controllers/user.controller");
const cart_service_1 = require("../../domain/services/cart.service");
const prisma_cart_repository_1 = require("../../infrastructure/persistence/prisma/prisma-cart.repository");
const wallet_module_1 = require("./wallet.module");
const shared_module_1 = require("../../shared/shared.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, passport_1.PassportModule, jwt_1.JwtModule.register({}), (0, common_1.forwardRef)(() => wallet_module_1.WalletModule), shared_module_1.SharedModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, cart_service_1.CartService,
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: 'CartRepository',
                useClass: prisma_cart_repository_1.PrismaCartRepository,
            },
        ],
        exports: [user_service_1.UserService, 'IUserRepository'],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map