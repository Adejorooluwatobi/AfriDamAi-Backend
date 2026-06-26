"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const ai_service_1 = require("../../domain/services/ai.service");
const ai_controller_1 = require("../controllers/ai.controller");
const shared_module_1 = require("../../shared/shared.module");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_user_repository_1 = require("../../infrastructure/persistence/prisma/prisma-user.repository");
const prisma_profile_repository_1 = require("../../infrastructure/persistence/prisma/prisma-profile.repository");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, shared_module_1.SharedModule, prisma_module_1.PrismaModule],
        controllers: [ai_controller_1.AiController],
        providers: [
            ai_service_1.AiService,
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository
            },
            {
                provide: 'IProfileRepository',
                useClass: prisma_profile_repository_1.PrismaProfileRepository
            }
        ],
        exports: [ai_service_1.AiService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map