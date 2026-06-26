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
var AdminNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationService = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
const client_1 = require("@prisma/client");
let AdminNotificationService = AdminNotificationService_1 = class AdminNotificationService {
    constructor(adminRepository, mailService) {
        this.adminRepository = adminRepository;
        this.mailService = mailService;
        this.logger = new common_1.Logger(AdminNotificationService_1.name);
    }
    async notify(category, eventName, detailsHtml, sendEmail = false) {
        const recipients = [client_1.AdminType.SUPER_ADMIN, client_1.AdminType.OPERATIONS_ADMIN];
        switch (category) {
            case 'APPOINTMENT':
                recipients.push(client_1.AdminType.MEDICAL_REVIEWER);
                break;
            case 'SALES':
                recipients.push(client_1.AdminType.VENDOR_MANAGER, client_1.AdminType.FINANCE_ADMIN);
                break;
            case 'SUBSCRIPTION':
                recipients.push(client_1.AdminType.FINANCE_ADMIN);
                break;
            case 'FINANCE':
                recipients.push(client_1.AdminType.FINANCE_ADMIN);
                break;
            case 'ACCOUNT':
                break;
        }
        const uniqueRoles = [...new Set(recipients)];
        try {
            const allAdmins = await Promise.all(uniqueRoles.map(role => this.adminRepository.findByRole(role)));
            const emailList = allAdmins.flat().map(admin => admin.email);
            const uniqueEmails = [...new Set(emailList)];
            if (uniqueEmails.length === 0) {
                this.logger.warn(`No admins found for category: ${category}. Notification skipped.`);
                return;
            }
            this.logger.log(`Dispatching notifications for ${eventName} (${category}) to ${uniqueEmails.length} admins (Email: ${sendEmail}).`);
            if (sendEmail) {
                await Promise.all(uniqueEmails.map(email => this.mailService.sendAdminNotificationEmail(email, eventName, `<h3>${eventName}</h3>${detailsHtml}`)));
            }
        }
        catch (error) {
            this.logger.error(`Failed to dispatch admin notifications for ${eventName}: ${error.message}`);
        }
    }
};
exports.AdminNotificationService = AdminNotificationService;
exports.AdminNotificationService = AdminNotificationService = AdminNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAdminRepository')),
    __metadata("design:paramtypes", [Object, mail_service_1.MailService])
], AdminNotificationService);
//# sourceMappingURL=admin-notification.service.js.map