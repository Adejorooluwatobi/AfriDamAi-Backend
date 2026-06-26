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
exports.ConsultationService = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const notification_service_1 = require("./notification.service");
const client_1 = require("@prisma/client");
let ConsultationService = class ConsultationService {
    constructor(consultationRepository, adminService, notificationService) {
        this.consultationRepository = consultationRepository;
        this.adminService = adminService;
        this.notificationService = notificationService;
    }
    async create(params) {
        const newConsultation = await this.consultationRepository.create(params);
        const [superAdmins, operationsAdmins] = await Promise.all([
            this.adminService.findByRole(client_1.AdminType.SUPER_ADMIN),
            this.adminService.findByRole(client_1.AdminType.OPERATIONS_ADMIN)
        ]);
        const adminsToNotify = [...superAdmins, ...operationsAdmins];
        const notificationPromises = adminsToNotify.map(admin => this.notificationService.createNotification({
            adminId: admin.id,
            title: 'New Consultation Created',
            message: `A new consultation has been created by ${params.name} (${params.email}). Title: ${params.title}`,
            isGeneral: false
        }));
        await Promise.all(notificationPromises);
        return newConsultation;
    }
    async findById(id) {
        const consultation = await this.consultationRepository.findById(id);
        return consultation;
    }
    async findAll() {
        const consultations = await this.consultationRepository.findAll();
        return consultations;
    }
    async update(id, params) {
        const updatedConsultation = await this.consultationRepository.update(id, params);
        return updatedConsultation;
    }
    async delete(id) {
        await this.consultationRepository.delete(id);
    }
};
exports.ConsultationService = ConsultationService;
exports.ConsultationService = ConsultationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ConsultationRepositoryInterface')),
    __metadata("design:paramtypes", [Object, admin_service_1.AdminService,
        notification_service_1.NotificationService])
], ConsultationService);
//# sourceMappingURL=consultation.service.js.map