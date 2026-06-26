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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organization_service_1 = require("../../domain/services/organization.service");
const create_organization_dto_1 = require("../../application/DTOs/organization/create-organization.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const organization_entity_1 = require("../../domain/entities/organization.entity");
const guards_1 = require("../auth/guards");
const client_1 = require("@prisma/client");
const specialist_service_1 = require("../../domain/services/specialist.service");
const create_specialist_dto_1 = require("../../application/DTOs/specialist/create-specialist.dto");
const specialist_mapper_1 = require("../../infrastructure/mappers/specialist.mapper");
const specialist_assignment_service_1 = require("../../domain/services/specialist-assignment.service");
const assign_specialists_dto_1 = require("../../application/DTOs/appointments/assign-specialists.dto");
const create_admin_dto_1 = require("../../application/DTOs/admin/create-admin.dto");
const admin_mapper_1 = require("../../infrastructure/mappers/admin.mapper");
let OrganizationController = class OrganizationController {
    constructor(organizationService, specialistService, specialistAssignmentService) {
        this.organizationService = organizationService;
        this.specialistService = specialistService;
        this.specialistAssignmentService = specialistAssignmentService;
    }
    async create(createOrganizationDto) {
        const org = await this.organizationService.createOrganization(createOrganizationDto);
        return {
            succeeded: true,
            message: 'Organization registered successfully',
            resultData: org,
        };
    }
    async findActive() {
        const orgs = await this.organizationService.findActive();
        return {
            succeeded: true,
            resultData: orgs,
        };
    }
    async findAll() {
        const orgs = await this.organizationService.findAll();
        return {
            succeeded: true,
            resultData: orgs,
        };
    }
    async findOne(id) {
        const org = await this.organizationService.findById(id);
        return {
            succeeded: true,
            resultData: org,
        };
    }
    async update(id, updateOrganizationDto, req) {
        const updatedOrg = await this.organizationService.updateOrganization(id, updateOrganizationDto);
        return {
            succeeded: true,
            message: 'Organization updated successfully',
            resultData: updatedOrg,
        };
    }
    async updateStatus(id, status) {
        const updatedOrg = await this.organizationService.updateOrganizationStatus(id, status);
        return {
            succeeded: true,
            message: `Organization status updated to ${status}`,
            resultData: updatedOrg,
        };
    }
    async getSpecialistsForOrganization(id) {
        const specialists = await this.specialistService.findByOrganization(id);
        const result = specialists.map(({ specialist, wallet }) => specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }));
        return {
            succeeded: true,
            resultData: result,
        };
    }
    async onboardSpecialist(id, createSpecialistDto) {
        await this.organizationService.findById(id);
        const specialistDto = {
            ...createSpecialistDto,
            organizationId: id,
        };
        const newSpecialist = await this.specialistService.createSpecialist(specialistDto);
        const { specialist: entity, wallet } = await this.specialistService.findById(newSpecialist.id);
        return {
            succeeded: true,
            message: 'Specialist onboarded successfully under organization',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist: entity, wallet }),
        };
    }
    async assignSpecialistToAppointment(organizationId, appointmentId, assignDto, req) {
        await this.organizationService.findById(organizationId);
        const adminId = req.user.id || req.user.sub;
        return this.specialistAssignmentService.assignSpecialists(appointmentId, assignDto.specialistIds, adminId);
    }
    validateDomainAccess(organizationId, req) {
        const user = req.user;
        if (user.type === client_1.AdminType.SUPER_ADMIN)
            return;
        if (user.type === client_1.AdminType.FACILITY_ADMIN) {
            if (user.organizationId !== organizationId) {
                throw new common_1.ForbiddenException('Access denied: You can only manage your own organization');
            }
            return;
        }
        throw new common_1.ForbiddenException('Access denied: Insufficient permissions for this organization');
    }
    async onboardFacilityAdmin(organizationId, createAdminDto, req) {
        this.validateDomainAccess(organizationId, req);
        const admin = await this.organizationService.onboardAdmin(organizationId, createAdminDto);
        return {
            succeeded: true,
            message: 'Facility Admin onboarded successfully',
            resultData: admin_mapper_1.AdminMapper.toSecureResponse(admin),
        };
    }
    async getAdminsForOrganization(organizationId, req) {
        this.validateDomainAccess(organizationId, req);
        const admins = await this.organizationService.getAdmins(organizationId);
        return {
            succeeded: true,
            resultData: admins.map(admin => admin_mapper_1.AdminMapper.toSecureResponse(admin)),
        };
    }
    async suspendAdmin(organizationId, adminId, req) {
        this.validateDomainAccess(organizationId, req);
        const admin = await this.organizationService.suspendAdmin(organizationId, adminId);
        return {
            succeeded: true,
            message: 'Admin suspended successfully',
            resultData: admin_mapper_1.AdminMapper.toSecureResponse(admin),
        };
    }
    async activateAdmin(organizationId, adminId, req) {
        this.validateDomainAccess(organizationId, req);
        const admin = await this.organizationService.activateAdmin(organizationId, adminId);
        return {
            succeeded: true,
            message: 'Admin activated successfully',
            resultData: admin_mapper_1.AdminMapper.toSecureResponse(admin),
        };
    }
    async suspendSpecialist(organizationId, specialistId, req) {
        this.validateDomainAccess(organizationId, req);
        const specialist = await this.organizationService.suspendSpecialist(organizationId, specialistId);
        const { wallet } = await this.specialistService.findById(specialistId);
        return {
            succeeded: true,
            message: 'Specialist suspended successfully',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
        };
    }
    async activateSpecialist(organizationId, specialistId, req) {
        this.validateDomainAccess(organizationId, req);
        const specialist = await this.organizationService.activateSpecialist(organizationId, specialistId);
        const { wallet } = await this.specialistService.findById(specialistId);
        return {
            succeeded: true,
            message: 'Specialist activated successfully',
            resultData: specialist_mapper_1.SpecialistMapper.toSecureSpecialistResponseDto({ specialist, wallet }),
        };
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new Hospital/Organization' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Organization created successfully', type: organization_entity_1.OrganizationEntity }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active organizations (Discovery for Patients)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organizations retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List ALL organizations (Admin Only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_organization_dto_1.UpdateOrganizationDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization status (Super Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id/specialists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all specialists for a hospital' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getSpecialistsForOrganization", null);
__decorate([
    (0, common_1.Post)(':id/specialists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Onboard a specialist under a hospital' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_specialist_dto_1.CreateSpecialistDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "onboardSpecialist", null);
__decorate([
    (0, common_1.Post)(':id/appointments/:appointmentId/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign specialists to an organization specific appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Specialist assigned successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, assign_specialists_dto_1.AssignSpecialistsDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "assignSpecialistToAppointment", null);
__decorate([
    (0, common_1.Post)(':id/admins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Onboard a Facility Admin under a hospital' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "onboardFacilityAdmin", null);
__decorate([
    (0, common_1.Get)(':id/admins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admins for a hospital' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getAdminsForOrganization", null);
__decorate([
    (0, common_1.Put)(':id/admins/:adminId/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend a Facility Admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('adminId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "suspendAdmin", null);
__decorate([
    (0, common_1.Put)(':id/admins/:adminId/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a Facility Admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('adminId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateAdmin", null);
__decorate([
    (0, common_1.Put)(':id/specialists/:specialistId/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend a Specialist' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('specialistId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "suspendSpecialist", null);
__decorate([
    (0, common_1.Put)(':id/specialists/:specialistId/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a Specialist' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('specialistId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateSpecialist", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('Organizations'),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService,
        specialist_service_1.SpecialistService,
        specialist_assignment_service_1.SpecialistAssignmentService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map