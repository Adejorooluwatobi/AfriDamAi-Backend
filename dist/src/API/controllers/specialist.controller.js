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
exports.SpecialistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const specialist_service_1 = require("../../domain/services/specialist.service");
const create_specialist_dto_1 = require("../../application/DTOs/specialist/create-specialist.dto");
const update_specialist_dto_1 = require("../../application/DTOs/specialist/update-specialist.dto");
const specialist_mapper_1 = require("../../infrastructure/mappers/specialist.mapper");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../auth/guards");
const response_dto_1 = require("../../application/DTOs/response.dto");
const update_account_status_dto_1 = require("../../application/DTOs/update-account-status.dto");
const update_suspension_status_dto_1 = require("../../application/DTOs/update-suspension-status.dto");
const update_approval_status_dto_1 = require("../../application/DTOs/update-approval-status.dto");
const client_1 = require("@prisma/client");
let SpecialistController = class SpecialistController {
    constructor(specialistService) {
        this.specialistService = specialistService;
    }
    async create(createSpecialistDto) {
        const specialist = await this.specialistService.createSpecialist(createSpecialistDto);
        if (!specialist) {
            throw new common_1.InternalServerErrorException('Specialist creation failed');
        }
        const { specialist: entity, wallet } = await this.specialistService.findById(specialist.id);
        return {
            succeeded: true,
            message: 'Specialist created successfully',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet })
        };
    }
    async findAll() {
        const specialists = await this.specialistService.findAll();
        const secureSpecialists = await Promise.all(specialists.map(async (s) => {
            const { wallet } = await this.specialistService.findById(s.id);
            return specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
        }));
        return {
            succeeded: true,
            message: 'Specialists retrieved successfully',
            resultData: secureSpecialists
        };
    }
    async findByType(type) {
        const specialists = await this.specialistService.findByType(type);
        const secureSpecialists = await Promise.all(specialists.map(async (s) => {
            const { wallet } = await this.specialistService.findById(s.id);
            return specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
        }));
        return {
            succeeded: true,
            message: `Specialists of type ${type} retrieved successfully`,
            resultData: secureSpecialists
        };
    }
    async findByStatus(status) {
        const specialists = await this.specialistService.findByStatus(status);
        const secureSpecialists = await Promise.all(specialists.map(async (s) => {
            const { wallet } = await this.specialistService.findById(s.id);
            return specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: s, wallet });
        }));
        return {
            succeeded: true,
            message: `Specialists with status ${status} retrieved successfully`,
            resultData: secureSpecialists
        };
    }
    async getMe(req) {
        const specialistId = this.extractSpecialistId(req.user);
        const { specialist, wallet } = await this.specialistService.findById(specialistId);
        if (!specialist) {
            throw new common_1.NotFoundException('Specialist not found');
        }
        const secureSpecialist = specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet });
        return {
            succeeded: true,
            message: 'Specialist info retrieved successfully',
            resultData: secureSpecialist
        };
    }
    extractSpecialistId(user) {
        const id = user.id || user.sub;
        if (id)
            return id;
        throw new common_1.UnauthorizedException('Specialist ID missing from token');
    }
    async findOne(id) {
        const specialist = await this.specialistService.findById(id);
        if (!specialist) {
            throw new common_1.NotFoundException('Specialist not found');
        }
        const { specialist: entity, wallet } = await this.specialistService.findById(id);
        return {
            succeeded: true,
            message: 'Specialist retrieved successfully',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet })
        };
    }
    async update(id, updateSpecialistDto) {
        const specialist = await this.specialistService.updateSpecialist(id, updateSpecialistDto);
        return {
            succeeded: true,
            message: 'Specialist updated successfully',
            resultData: (specialist)
        };
    }
    async updateApprovalStatus(id, statusDto) {
        const specialist = await this.specialistService.updateSpecialistStatus(id, statusDto.status);
        const { wallet } = await this.specialistService.findById(specialist.id);
        return {
            succeeded: true,
            message: 'Specialist approval status updated successfully',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
        };
    }
    async updateSuspensionStatus(id, statusDto) {
        const specialist = await this.specialistService.updateSpecialistSuspensionStatus(id, statusDto.isSuspended);
        const { wallet } = await this.specialistService.findById(specialist.id);
        return {
            succeeded: true,
            message: `Specialist account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet })
        };
    }
    async remove(id) {
        await this.specialistService.deleteSpecialist(id);
        return {
            succeeded: true,
            message: 'Specialist deleted successfully'
        };
    }
    async updateActiveStatus(id, statusDto) {
        const specialist = await this.specialistService.updateSpecialistActiveStatus(id, statusDto.isActive);
        const { wallet } = await this.specialistService.findById(specialist.id);
        return {
            succeeded: true,
            message: `Specialist account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet })
        };
    }
};
exports.SpecialistController = SpecialistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new specialist' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Specialist created successfully' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialist_dto_1.CreateSpecialistDto]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all specialists' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist retrieved successfully', type: [response_dto_1.SecureSpecialistResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve specialists by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialists retrieved successfully', type: [response_dto_1.SecureSpecialistResponseDto] }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve specialists by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialists retrieved successfully', type: [response_dto_1.SecureSpecialistResponseDto] }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current specialist info with profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist retrieved successfully', type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specialist by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist retrieved successfully', type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.SpecialistOrAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specialist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist updated successfully', type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_specialist_dto_1.UpdateSpecialistDto]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/approval-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specialist\'s approval status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist approval status updated successfully', type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_approval_status_dto_1.UpdateApprovalStatusDto]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "updateApprovalStatus", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)(':id/suspension-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend/Unsuspend specialist account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_suspension_status_dto_1.UpdateSuspensionStatusDto]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "updateSuspensionStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specialist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist deleted successfully', type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/active-status'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enable/Disable specialist account (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_dto_1.SecureSpecialistResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], SpecialistController.prototype, "updateActiveStatus", null);
exports.SpecialistController = SpecialistController = __decorate([
    (0, swagger_1.ApiTags)('Specialists'),
    (0, common_1.Controller)('specialists'),
    __metadata("design:paramtypes", [specialist_service_1.SpecialistService])
], SpecialistController);
//# sourceMappingURL=specialist.controller.js.map