"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValueModule = void 0;
const common_1 = require("@nestjs/common");
const attribute_value_controller_1 = require("../controllers/attribute-value.controller");
const attribute_value_service_1 = require("../../domain/services/attribute-value.service");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_attribute_value_repository_1 = require("../../infrastructure/persistence/prisma/prisma-attribute-value.repository");
const prisma_attribute_repository_1 = require("../../infrastructure/persistence/prisma/prisma-attribute.repository");
const auth_module_1 = require("../auth/auth.module");
let AttributeValueModule = class AttributeValueModule {
};
exports.AttributeValueModule = AttributeValueModule;
exports.AttributeValueModule = AttributeValueModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [attribute_value_controller_1.AttributeValueController],
        providers: [
            attribute_value_service_1.AttributeValueService,
            {
                provide: 'IAttributeValueRepository',
                useClass: prisma_attribute_value_repository_1.PrismaAttributeValueRepository,
            },
            {
                provide: 'IAttributeRepository',
                useClass: prisma_attribute_repository_1.PrismaAttributeRepository,
            },
        ],
        exports: [attribute_value_service_1.AttributeValueService],
    })
], AttributeValueModule);
//# sourceMappingURL=attributes-value.module.js.map