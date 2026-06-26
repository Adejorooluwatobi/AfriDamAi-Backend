"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorDocumentModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const vendor_document_service_1 = require("../../domain/services/vendor-document.service");
const vendor_document_controller_1 = require("../controllers/vendor-document.controller");
const prisma_vendor_document_repository_1 = require("../../infrastructure/repositories/prisma-vendor-document.repository");
let VendorDocumentModule = class VendorDocumentModule {
};
exports.VendorDocumentModule = VendorDocumentModule;
exports.VendorDocumentModule = VendorDocumentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [vendor_document_controller_1.VendorDocumentController],
        providers: [
            vendor_document_service_1.VendorDocumentService,
            {
                provide: 'IVendorDocumentRepository',
                useClass: prisma_vendor_document_repository_1.PrismaVendorDocumentRepository,
            },
        ],
        exports: [vendor_document_service_1.VendorDocumentService],
    })
], VendorDocumentModule);
//# sourceMappingURL=vendor-document.module.js.map