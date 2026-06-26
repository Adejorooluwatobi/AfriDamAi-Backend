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
var SessionCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const appointment_service_1 = require("./appointment.service");
const client_1 = require("@prisma/client");
let SessionCronService = SessionCronService_1 = class SessionCronService {
    constructor(prisma, appointmentService) {
        this.prisma = prisma;
        this.appointmentService = appointmentService;
        this.logger = new common_1.Logger(SessionCronService_1.name);
    }
    async handleExpiredSessions() {
        this.logger.log('Checking for expired appointment sessions...');
        const now = new Date();
        const expiredSessions = await this.prisma.appointment.findMany({
            where: {
                status: client_1.AppointmentStatus.IN_PROGRESS,
                endedAt: {
                    lt: now,
                },
                isExtended: false,
            },
            select: {
                id: true,
                userId: true,
            },
        });
        if (expiredSessions.length > 0) {
            this.logger.log(`Found ${expiredSessions.length} expired sessions. Processing...`);
            for (const session of expiredSessions) {
                try {
                    await this.appointmentService.endSession(session.id, 'SYSTEM');
                    this.logger.log(`Automatically ended expired session ${session.id}`);
                }
                catch (error) {
                    this.logger.error(`Failed to automatically end session ${session.id}`, error);
                }
            }
        }
        else {
            this.logger.log('No expired sessions found.');
        }
    }
};
exports.SessionCronService = SessionCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionCronService.prototype, "handleExpiredSessions", null);
exports.SessionCronService = SessionCronService = SessionCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        appointment_service_1.AppointmentService])
], SessionCronService);
//# sourceMappingURL=session-cron.service.js.map