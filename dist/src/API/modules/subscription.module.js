"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const schedule_1 = require("@nestjs/schedule");
const subscription_cron_service_1 = require("../../domain/services/subscription-cron.service");
const subscription_controller_1 = require("../controllers/subscription.controller");
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const pricing_plan_module_1 = require("./pricing-plan.module");
const admin_module_1 = require("./admin.module");
const subscription_service_1 = require("../../domain/services/subscription.service");
const prisma_subscription_repository_1 = require("../../infrastructure/persistence/prisma/prisma-subscription.repository");
const prisma_user_repository_1 = require("../../infrastructure/persistence/prisma/prisma-user.repository");
let SubscriptionModule = class SubscriptionModule {
};
exports.SubscriptionModule = SubscriptionModule;
exports.SubscriptionModule = SubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            pricing_plan_module_1.PricingPlanModule,
            admin_module_1.AdminModule,
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [subscription_controller_1.SubscriptionController],
        providers: [
            subscription_service_1.SubscriptionService,
            subscription_cron_service_1.SubscriptionCronService,
            {
                provide: 'ISubscriptionRepository',
                useClass: prisma_subscription_repository_1.PrismaSubscriptionRepository,
            },
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [subscription_service_1.SubscriptionService],
    })
], SubscriptionModule);
//# sourceMappingURL=subscription.module.js.map