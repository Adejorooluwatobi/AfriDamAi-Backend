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
var OrganizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const admin_service_1 = require("./admin.service");
const specialist_service_1 = require("./specialist.service");
let OrganizationService = OrganizationService_1 = class OrganizationService {
    constructor(organizationRepository, adminService, specialistService) {
        this.organizationRepository = organizationRepository;
        this.adminService = adminService;
        this.specialistService = specialistService;
        this.logger = new common_1.Logger(OrganizationService_1.name);
    }
    async createOrganization(params) {
        const existingOrg = await this.organizationRepository.findByEmail(params.email);
        if (existingOrg) {
            throw new common_1.BadRequestException('Organization with this email already exists');
        }
        const newOrg = await this.organizationRepository.create({
            ...params,
            status: params.status ?? client_1.OrganizationStatus.PENDING,
            isActive: params.isActive ?? true,
        });
        this.logger.log(`Created Organization: ${newOrg.id}`);
        return newOrg;
    }
    async findById(id) {
        const org = await this.organizationRepository.findById(id);
        if (!org) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return org;
    }
    async findAll() {
        return this.organizationRepository.findAll();
    }
    async findActive() {
        return this.organizationRepository.findActive();
    }
    async updateOrganization(id, params) {
        const org = await this.findById(id);
        if (params.email && params.email !== org.email) {
            const existingEmail = await this.organizationRepository.findByEmail(params.email);
            if (existingEmail)
                throw new common_1.BadRequestException('Email is already in use by another organization');
        }
        const updatedOrg = await this.organizationRepository.update(id, params);
        this.logger.log(`Updated Organization: ${id}`);
        return updatedOrg;
    }
    async updateOrganizationStatus(id, status) {
        const org = await this.findById(id);
        const updated = await this.organizationRepository.update(id, { status });
        this.logger.log(`Updated Organization: ${id} status to ${status}`);
        return updated;
    }
    async deleteOrganization(id) {
        const org = await this.findById(id);
        await this.organizationRepository.delete(id);
        this.logger.log(`Deleted Organization: ${id}`);
    }
    async onboardAdmin(organizationId, adminParams) {
        const org = await this.findById(organizationId);
        if (org.status !== client_1.OrganizationStatus.APPROVED) {
            throw new common_1.BadRequestException('Organization must be APPROVED to onboard admins');
        }
        return this.adminService.createAdmin({
            ...adminParams,
            organizationId,
            type: client_1.AdminType.FACILITY_ADMIN,
        });
    }
    async getAdmins(organizationId) {
        const admins = await this.adminService.findAllAdmin();
        return admins.filter(admin => admin.organizationId === organizationId);
    }
    async getSpecialists(organizationId) {
        const wrapped = await this.specialistService.findByOrganization(organizationId);
        return wrapped.map(w => w.specialist);
    }
    async suspendAdmin(organizationId, adminId) {
        const admin = await this.adminService.findOneAdmin(adminId);
        if (!admin || admin.organizationId !== organizationId) {
            throw new common_1.NotFoundException('Admin not found in this organization');
        }
        return this.adminService.updateAdminActiveStatus(adminId, false);
    }
    async activateAdmin(organizationId, adminId) {
        const admin = await this.adminService.findOneAdmin(adminId);
        if (!admin || admin.organizationId !== organizationId) {
            throw new common_1.NotFoundException('Admin not found in this organization');
        }
        return this.adminService.updateAdminActiveStatus(adminId, true);
    }
    async suspendSpecialist(organizationId, specialistId) {
        const { specialist } = await this.specialistService.findById(specialistId);
        if (!specialist || specialist.organizationId !== organizationId) {
            throw new common_1.NotFoundException('Specialist not found in this organization');
        }
        return this.specialistService.updateSpecialistActiveStatus(specialistId, false);
    }
    async activateSpecialist(organizationId, specialistId) {
        const { specialist } = await this.specialistService.findById(specialistId);
        if (!specialist || specialist.organizationId !== organizationId) {
            throw new common_1.NotFoundException('Specialist not found in this organization');
        }
        return this.specialistService.updateSpecialistActiveStatus(specialistId, true);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = OrganizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IOrganizationRepository')),
    __metadata("design:paramtypes", [Object, admin_service_1.AdminService,
        specialist_service_1.SpecialistService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map