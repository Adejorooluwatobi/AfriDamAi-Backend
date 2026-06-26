"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const common_1 = require("@nestjs/common");
const organization_controller_1 = require("../controllers/organization.controller");
const organization_service_1 = require("../../domain/services/organization.service");
const prisma_organization_repository_1 = require("../../infrastructure/persistence/prisma/prisma-organization.repository");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const specialist_module_1 = require("./specialist.module");
const appointment_module_1 = require("./appointment.module");
const admin_module_1 = require("./admin.module");
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = __decorate([
    (0, common_1.Module)({
        imports: [specialist_module_1.SpecialistModule, appointment_module_1.AppointmentModule, admin_module_1.AdminModule],
        controllers: [organization_controller_1.OrganizationController],
        providers: [
            organization_service_1.OrganizationService,
            prisma_service_1.PrismaService,
            {
                provide: 'IOrganizationRepository',
                useClass: prisma_organization_repository_1.PrismaOrganizationRepository,
            },
        ],
        exports: [organization_service_1.OrganizationService],
    })
], OrganizationModule);
//# sourceMappingURL=organization.module.js.map