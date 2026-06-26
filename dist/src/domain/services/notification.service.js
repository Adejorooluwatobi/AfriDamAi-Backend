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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async createNotification(params) {
        const notification = await this.notificationRepository.create(params);
        return notification;
    }
    async findById(id) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with id ${id} not found`);
        }
        return notification;
    }
    async getUserNotifications(userId) {
        return this.notificationRepository.findByUserId(userId);
    }
    async getAdminNotifications(adminId) {
        return this.notificationRepository.findByAdminId(adminId);
    }
    async getVendorNotifications(vendorId) {
        return this.notificationRepository.findByVendorId(vendorId);
    }
    async getSpecialistNotifications(specialistId) {
        return this.notificationRepository.findBySpecialistId(specialistId);
    }
    async getAllNotifications() {
        return this.notificationRepository.findAll();
    }
    async markAsRead(id) {
        await this.findById(id);
        return this.notificationRepository.markAsRead(id);
    }
    async markAllAsRead(userId) {
        return this.notificationRepository.markAllAsRead(userId);
    }
    async deleteNotification(id) {
        await this.findById(id);
        await this.notificationRepository.delete(id);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('INotificationRepository')),
    __metadata("design:paramtypes", [Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map