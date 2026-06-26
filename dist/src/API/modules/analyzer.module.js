"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const analyzer_service_1 = require("../../domain/services/analyzer.service");
const prisma_analyzer_repository_1 = require("../../infrastructure/persistence/prisma/prisma-analyzer.repository");
const prisma_user_repository_1 = require("../../infrastructure/persistence/prisma/prisma-user.repository");
const prisma_profile_repository_1 = require("../../infrastructure/persistence/prisma/prisma-profile.repository");
const analyzer_controller_1 = require("../controllers/analyzer.controller");
const axios_1 = require("@nestjs/axios");
const shared_module_1 = require("../../shared/shared.module");
let AnalyzerModule = class AnalyzerModule {
};
exports.AnalyzerModule = AnalyzerModule;
exports.AnalyzerModule = AnalyzerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, axios_1.HttpModule, shared_module_1.SharedModule],
        controllers: [analyzer_controller_1.AnalyzerController],
        providers: [
            analyzer_service_1.AnalyzerService,
            {
                provide: 'IAnalyzerRepository',
                useClass: prisma_analyzer_repository_1.PrismaAnalyzerRepository
            },
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository
            },
            {
                provide: 'IProfileRepository',
                useClass: prisma_profile_repository_1.PrismaProfileRepository
            }
        ],
        exports: [analyzer_service_1.AnalyzerService],
    })
], AnalyzerModule);
//# sourceMappingURL=analyzer.module.js.map