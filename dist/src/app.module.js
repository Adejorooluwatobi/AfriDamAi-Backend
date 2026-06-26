"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./application/use-cases/app.service");
const consultation_module_1 = require("./API/modules/consultation.module");
const invoice_module_1 = require("./API/modules/invoice.module");
const appointment_module_1 = require("./API/modules/appointment.module");
const pricing_plan_module_1 = require("./API/modules/pricing-plan.module");
const subscription_module_1 = require("./API/modules/subscription.module");
const user_module_1 = require("./API/modules/user.module");
const product_module_1 = require("./API/modules/product.module");
const order_module_1 = require("./API/modules/order.module");
const cart_module_1 = require("./API/modules/cart.module");
const category_module_1 = require("./API/modules/category.module");
const vendor_module_1 = require("./API/modules/vendor.module");
const admin_module_1 = require("./API/modules/admin.module");
const analyzer_module_1 = require("./API/modules/analyzer.module");
const ai_module_1 = require("./API/modules/ai.module");
const profile_module_1 = require("./API/modules/profile.module");
const transaction_module_1 = require("./API/modules/transaction.module");
const wishlist_module_1 = require("./API/modules/wishlist.module");
const coupon_module_1 = require("./API/modules/coupon.module");
const attribute_module_1 = require("./API/modules/attribute.module");
const specialist_module_1 = require("./API/modules/specialist.module");
const specialist_document_module_1 = require("./API/modules/specialist-document.module");
const vendor_document_module_1 = require("./API/modules/vendor-document.module");
const notification_module_1 = require("./API/modules/notification.module");
const chat_module_1 = require("./API/modules/chat.module");
const mail_module_1 = require("./infrastructure/messaging/mail/mail.module");
const prisma_module_1 = require("./infrastructure/persistence/prisma/prisma.module");
const shared_module_1 = require("./shared/shared.module");
const wallet_module_1 = require("./API/modules/wallet.module");
const seed_module_1 = require("./API/modules/seed.module");
const cleanup_module_1 = require("./API/modules/cleanup.module");
const schedule_1 = require("@nestjs/schedule");
const livekit_module_1 = require("./API/modules/livekit.module");
const organization_module_1 = require("./API/modules/organization.module");
let AppModule = class AppModule {
    configure(consumer) {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            shared_module_1.SharedModule,
            user_module_1.UserModule,
            admin_module_1.AdminModule,
            vendor_module_1.VendorModule,
            organization_module_1.OrganizationModule,
            profile_module_1.ProfileModule,
            specialist_module_1.SpecialistModule,
            specialist_document_module_1.SpecialistDocumentModule,
            vendor_document_module_1.VendorDocumentModule,
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            order_module_1.OrderModule,
            cart_module_1.CartModule,
            wishlist_module_1.WishlistModule,
            coupon_module_1.CouponModule,
            attribute_module_1.AttributeModule,
            appointment_module_1.AppointmentModule,
            subscription_module_1.SubscriptionModule,
            consultation_module_1.ConsultationModule,
            analyzer_module_1.AnalyzerModule,
            ai_module_1.AiModule,
            chat_module_1.ChatModule,
            notification_module_1.NotificationModule,
            transaction_module_1.TransactionModule,
            pricing_plan_module_1.PricingPlanModule,
            invoice_module_1.InvoiceModule,
            wallet_module_1.WalletModule,
            seed_module_1.SeedModule,
            cleanup_module_1.CleanupModule,
            livekit_module_1.LiveKitModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map