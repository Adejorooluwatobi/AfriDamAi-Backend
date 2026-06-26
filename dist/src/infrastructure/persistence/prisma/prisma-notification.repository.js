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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const notification_mapper_1 = require("../../mappers/notification.mapper");
const prisma_service_1 = require("./prisma.service");
let NotificationRepository = class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        return notification ? notification_mapper_1.NotificationMapper.toDomain(notification) : null;
    }
    async findByUserId(userId) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return notification_mapper_1.NotificationMapper.toDomainArray(notifications);
    }
    async findByAdminId(adminId) {
        const notifications = await this.prisma.notification.findMany({
            where: { adminId },
            orderBy: { createdAt: 'desc' },
        });
        return notification_mapper_1.NotificationMapper.toDomainArray(notifications);
    }
    async findByVendorId(vendorId) {
        const notifications = await this.prisma.notification.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
        });
        return notification_mapper_1.NotificationMapper.toDomainArray(notifications);
    }
    async findBySpecialistId(specialistId) {
        const notifications = await this.prisma.notification.findMany({
            where: { specialistId },
            orderBy: { createdAt: 'desc' },
        });
        return notification_mapper_1.NotificationMapper.toDomainArray(notifications);
    }
    async findAll() {
        const notifications = await this.prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return notification_mapper_1.NotificationMapper.toDomainArray(notifications);
    }
    async create(params) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: params.userId,
                adminId: params.adminId,
                vendorId: params.vendorId,
                specialistId: params.specialistId,
                isGeneral: params.isGeneral ?? false,
                title: params.title,
                message: params.message,
            },
        });
        return notification_mapper_1.NotificationMapper.toDomain(notification);
    }
    async markAsRead(id) {
        const notification = await this.prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return notification_mapper_1.NotificationMapper.toDomain(notification);
    }
    async markAllAsRead(id) {
        await this.prisma.notification.updateMany({
            where: {
                OR: [
                    { userId: id },
                    { adminId: id },
                    { specialistId: id },
                    { vendorId: id },
                ],
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async delete(id) {
        await this.prisma.notification.delete({
            where: { id },
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationRepository);
//# sourceMappingURL=prisma-notification.repository.js.map