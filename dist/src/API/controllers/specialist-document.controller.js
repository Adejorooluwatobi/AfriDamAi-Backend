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
exports.SpecialistDocumentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const specialist_document_service_1 = require("../../domain/services/specialist-document.service");
const upsert_specialist_document_dto_1 = require("../../application/DTOs/documents/upsert-specialist-document.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SpecialistDocumentController = class SpecialistDocumentController {
    constructor(specialistDocumentService) {
        this.specialistDocumentService = specialistDocumentService;
    }
    async getMyDocument(req) {
        return this.specialistDocumentService.getDocument(req.user.id);
    }
    async upsertMyDocument(req, dto) {
        return this.specialistDocumentService.upsertDocument(req.user.id, dto);
    }
};
exports.SpecialistDocumentController = SpecialistDocumentController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my document profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpecialistDocumentController.prototype, "getMyDocument", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update my document profile (bank details, licence, address, etc.)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_specialist_document_dto_1.UpsertSpecialistDocumentDto]),
    __metadata("design:returntype", Promise)
], SpecialistDocumentController.prototype, "upsertMyDocument", null);
exports.SpecialistDocumentController = SpecialistDocumentController = __decorate([
    (0, swagger_1.ApiTags)('Specialist Documents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('specialist-documents'),
    __metadata("design:paramtypes", [specialist_document_service_1.SpecialistDocumentService])
], SpecialistDocumentController);
//# sourceMappingURL=specialist-document.controller.js.map