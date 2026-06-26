"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorDocumentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vendor_document_service_1 = require("../../domain/services/vendor-document.service");
const upsert_vendor_document_dto_1 = require("../../application/DTOs/documents/upsert-vendor-document.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VendorDocumentController = class VendorDocumentController {
    constructor(vendorDocumentService) {
        this.vendorDocumentService = vendorDocumentService;
    }
    async getMyDocument(req) {
        return this.vendorDocumentService.getDocument(req.user.id);
    }
    async upsertMyDocument(req, dto) {
        return this.vendorDocumentService.upsertDocument(req.user.id, dto);
    }
};
exports.VendorDocumentController = VendorDocumentController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my vendor document profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VendorDocumentController.prototype, "getMyDocument", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update my vendor document profile (bank details, CAC docs, director info, etc.)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_vendor_document_dto_1.UpsertVendorDocumentDto]),
    __metadata("design:returntype", Promise)
], VendorDocumentController.prototype, "upsertMyDocument", null);
exports.VendorDocumentController = VendorDocumentController = __decorate([
    (0, swagger_1.ApiTags)('Vendor Documents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('vendor-documents'),
    __metadata("design:paramtypes", [vendor_document_service_1.VendorDocumentService])
], VendorDocumentController);
//# sourceMappingURL=vendor-document.controller.js.map