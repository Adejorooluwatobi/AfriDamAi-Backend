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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("../../domain/services/notification.service");
const create_notification_dto_1 = require("../../application/DTOs/notification/create-notification.dto");
const notification_mapper_1 = require("../../infrastructure/mappers/notification.mapper");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../auth/guards");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async create(createNotificationDto) {
        const notification = await this.notificationService.createNotification(createNotificationDto);
        return {
            succeeded: true,
            message: 'Notification created successfully',
            resultData: notification_mapper_1.NotificationMapper.toDto(notification)
        };
    }
    async getMyNotifications(req) {
        const userId = this.extractUserId(req.user);
        const userRole = req.user?.role || req.user?.user?.role;
        let notifications = [];
        if (userRole === 'specialist') {
            notifications = await this.notificationService.getSpecialistNotifications(userId);
        }
        else if (userRole === 'admin') {
            notifications = await this.notificationService.getAdminNotifications(userId);
        }
        else if (userRole === 'vendor') {
            notifications = await this.notificationService.getVendorNotifications(userId);
        }
        else {
            notifications = await this.notificationService.getUserNotifications(userId);
        }
        return {
            succeeded: true,
            message: 'Notifications retrieved successfully',
            resultData: notifications.map(n => notification_mapper_1.NotificationMapper.toDto(n))
        };
    }
    async getAllNotifications() {
        const notifications = await this.notificationService.getAllNotifications();
        return {
            succeeded: true,
            message: 'All notifications retrieved successfully',
            resultData: notifications.map(n => notification_mapper_1.NotificationMapper.toDto(n))
        };
    }
    async markAsRead(id) {
        const notification = await this.notificationService.markAsRead(id);
        return {
            succeeded: true,
            message: 'Notification marked as read',
            resultData: notification_mapper_1.NotificationMapper.toDto(notification)
        };
    }
    async markAllAsRead(req) {
        const userId = this.extractUserId(req.user);
        await this.notificationService.markAllAsRead(userId);
        return {
            succeeded: true,
            message: 'All notifications marked as read'
        };
    }
    async remove(id) {
        await this.notificationService.deleteNotification(id);
        return {
            succeeded: true,
            message: 'Notification deleted successfully'
        };
    }
    extractUserId(user) {
        const id = user.user?.id || user.id || user.sub;
        if (id)
            return id;
        throw new common_1.NotFoundException('User ID missing from session');
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a notification (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notification created successfully' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user notifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllNotifications", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map