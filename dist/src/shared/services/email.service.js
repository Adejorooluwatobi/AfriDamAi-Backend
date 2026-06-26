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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const environment_service_1 = require("./environment.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(envService) {
        this.envService = envService;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendPasswordResetEmail(email, resetToken) {
        try {
            this.logger.log(`Password reset email would be sent to: ${email}`);
            if (this.envService.isDevelopment) {
                this.logger.debug(`Reset token: ${resetToken}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to send password reset email', error);
        }
    }
    async sendWelcomeEmail(email, _firstName) {
        try {
            this.logger.log(`Welcome email would be sent to: ${email}`);
        }
        catch (error) {
            this.logger.error('Failed to send welcome email', error);
        }
    }
    async sendAppointmentConfirmation(email, _appointmentDetails) {
        try {
            this.logger.log(`Appointment confirmation would be sent to: ${email}`);
        }
        catch (error) {
            this.logger.error('Failed to send appointment confirmation', error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [environment_service_1.EnvironmentService])
], EmailService);
//# sourceMappingURL=email.service.js.map