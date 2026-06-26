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
exports.ConsultationController = void 0;
const swagger_1 = require("@nestjs/swagger");
const consultation_entity_1 = require("../../domain/entities/consultation.entity");
const consultation_service_1 = require("../../domain/services/consultation.service");
const common_1 = require("@nestjs/common");
const create_consultation_dto_1 = require("../../application/DTOs/consultation/create-consultation.dto");
const update_consultation_dto_1 = require("../../application/DTOs/consultation/update-consultation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_permission_guard_1 = require("../auth/guards/admin-permission.guard");
let ConsultationController = class ConsultationController {
    constructor(consultationService) {
        this.consultationService = consultationService;
    }
    async create(createConsultationDto) {
        const consultation = await this.consultationService.create({ ...createConsultationDto });
        return {
            succeeded: true,
            message: 'Consultation created successfully',
            resultData: consultation
        };
    }
    async findAll() {
        const consultations = await this.consultationService.findAll();
        return {
            succeeded: true,
            message: 'Consultations retrieved successfully',
            resultData: consultations
        };
    }
    async findById(id) {
        const consultation = await this.consultationService.findById(id);
        return {
            succeeded: true,
            message: 'Consultation retrieved successfully',
            resultData: consultation
        };
    }
    async update(id, updateConsultationDto) {
        const consultation = await this.consultationService.update(id, updateConsultationDto);
        return {
            succeeded: true,
            message: 'Consultation updated successfully',
            resultData: consultation
        };
    }
    async delete(id) {
        await this.consultationService.delete(id);
        return {
            succeeded: true,
            message: 'Consultation deleted successfully',
            resultData: { id }
        };
    }
};
exports.ConsultationController = ConsultationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new consultation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Consultation created successfully', type: consultation_entity_1.ConsultationEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_dto_1.CreateConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_permission_guard_1.OperationsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all consultations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultations retrieved successfully', type: [consultation_entity_1.ConsultationEntity] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_permission_guard_1.OperationsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get consultation by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation retrieved successfully', type: consultation_entity_1.ConsultationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_permission_guard_1.OperationsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update consultation by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation updated successfully', type: consultation_entity_1.ConsultationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultation_dto_1.UpdateConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_permission_guard_1.OperationsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete consultation by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "delete", null);
exports.ConsultationController = ConsultationController = __decorate([
    (0, swagger_1.ApiTags)('Consultation'),
    (0, common_1.Controller)('consultation'),
    __metadata("design:paramtypes", [consultation_service_1.ConsultationService])
], ConsultationController);
//# sourceMappingURL=consultation.controller.js.map