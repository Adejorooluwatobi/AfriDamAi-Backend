"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModule = void 0;
const common_1 = require("@nestjs/common");
const appointment_controller_1 = require("../controllers/appointment.controller");
const appointment_service_1 = require("../../domain/services/appointment.service");
const subscription_validation_service_1 = require("../../domain/services/subscription-validation.service");
const specialist_assignment_service_1 = require("../../domain/services/specialist-assignment.service");
const transaction_module_1 = require("./transaction.module");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const prisma_appointment_repository_1 = require("../../infrastructure/persistence/prisma/prisma-appointment.repository");
const prisma_specialist_assignment_repository_1 = require("../../infrastructure/persistence/prisma/prisma-specialist-assignment.repository");
const pricing_plan_module_1 = require("./pricing-plan.module");
const subscription_module_1 = require("./subscription.module");
const shared_module_1 = require("../../shared/shared.module");
const notification_module_1 = require("./notification.module");
const admin_module_1 = require("./admin.module");
const specialist_module_1 = require("./specialist.module");
const wallet_module_1 = require("./wallet.module");
const session_cron_service_1 = require("../../domain/services/session-cron.service");
let AppointmentModule = class AppointmentModule {
};
exports.AppointmentModule = AppointmentModule;
exports.AppointmentModule = AppointmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            transaction_module_1.TransactionModule,
            pricing_plan_module_1.PricingPlanModule,
            subscription_module_1.SubscriptionModule,
            shared_module_1.SharedModule,
            notification_module_1.NotificationModule,
            admin_module_1.AdminModule,
            specialist_module_1.SpecialistModule,
            wallet_module_1.WalletModule,
        ],
        controllers: [appointment_controller_1.AppointmentController],
        providers: [
            appointment_service_1.AppointmentService,
            subscription_validation_service_1.SubscriptionValidationService,
            specialist_assignment_service_1.SpecialistAssignmentService,
            session_cron_service_1.SessionCronService,
            {
                provide: 'IAppointmentRepository',
                useClass: prisma_appointment_repository_1.PrismaAppointmentRepository,
            },
            {
                provide: 'ISpecialistAssignmentRepository',
                useClass: prisma_specialist_assignment_repository_1.PrismaSpecialistAssignmentRepository,
            },
        ],
        exports: [appointment_service_1.AppointmentService, specialist_assignment_service_1.SpecialistAssignmentService],
    })
], AppointmentModule);
//# sourceMappingURL=appointment.module.js.map