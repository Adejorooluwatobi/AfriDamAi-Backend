"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const specialist_service_1 = require("../../domain/services/specialist.service");
const specialist_controller_1 = require("../controllers/specialist.controller");
const prisma_specialist_repository_1 = require("../../infrastructure/persistence/prisma/prisma-specialist.repository");
const wallet_module_1 = require("./wallet.module");
let SpecialistModule = class SpecialistModule {
};
exports.SpecialistModule = SpecialistModule;
exports.SpecialistModule = SpecialistModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, (0, common_1.forwardRef)(() => wallet_module_1.WalletModule)],
        controllers: [specialist_controller_1.SpecialistController],
        providers: [
            specialist_service_1.SpecialistService,
            {
                provide: 'ISpecialistRepository',
                useClass: prisma_specialist_repository_1.SpecialistRepository,
            },
        ],
        exports: [specialist_service_1.SpecialistService, 'ISpecialistRepository'],
    })
], SpecialistModule);
//# sourceMappingURL=specialist.module.js.map