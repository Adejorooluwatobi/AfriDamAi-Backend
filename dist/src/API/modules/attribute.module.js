"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeModule = void 0;
const common_1 = require("@nestjs/common");
const attribute_controller_1 = require("../controllers/attribute.controller");
const attribute_service_1 = require("../../domain/services/attribute.service");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_attribute_repository_1 = require("../../infrastructure/persistence/prisma/prisma-attribute.repository");
const auth_module_1 = require("../auth/auth.module");
let AttributeModule = class AttributeModule {
};
exports.AttributeModule = AttributeModule;
exports.AttributeModule = AttributeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [attribute_controller_1.AttributeController],
        providers: [
            attribute_service_1.AttributeService,
            {
                provide: 'IAttributeRepository',
                useClass: prisma_attribute_repository_1.PrismaAttributeRepository,
            },
        ],
        exports: [attribute_service_1.AttributeService],
    })
], AttributeModule);
//# sourceMappingURL=attribute.module.js.map