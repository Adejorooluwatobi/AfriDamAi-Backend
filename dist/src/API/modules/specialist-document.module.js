"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistDocumentModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const specialist_document_service_1 = require("../../domain/services/specialist-document.service");
const specialist_document_controller_1 = require("../controllers/specialist-document.controller");
const prisma_specialist_document_repository_1 = require("../../infrastructure/repositories/prisma-specialist-document.repository");
let SpecialistDocumentModule = class SpecialistDocumentModule {
};
exports.SpecialistDocumentModule = SpecialistDocumentModule;
exports.SpecialistDocumentModule = SpecialistDocumentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [specialist_document_controller_1.SpecialistDocumentController],
        providers: [
            specialist_document_service_1.SpecialistDocumentService,
            {
                provide: 'ISpecialistDocumentRepository',
                useClass: prisma_specialist_document_repository_1.PrismaSpecialistDocumentRepository,
            },
        ],
        exports: [specialist_document_service_1.SpecialistDocumentService],
    })
], SpecialistDocumentModule);
//# sourceMappingURL=specialist-document.module.js.map