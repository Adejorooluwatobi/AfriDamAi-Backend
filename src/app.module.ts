import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './application/use-cases/app.service';
import { ConsultationModule } from './API/modules/consultation.module';
import { InvoiceModule } from './API/modules/invoice.module';
import { AppointmentModule } from './API/modules/appointment.module';
import { PricingPlanModule } from './API/modules/pricing-plan.module';
import { SubscriptionModule } from './API/modules/subscription.module';
import { UserModule } from './API/modules/user.module';
import { ProductModule } from './API/modules/product.module';
import { OrderModule } from './API/modules/order.module';
import { CartModule } from './API/modules/cart.module';
import { CategoryModule } from './API/modules/category.module';
import { VendorModule } from './API/modules/vendor.module';
import { AdminModule } from './API/modules/admin.module';
import { AnalyzerModule } from './API/modules/analyzer.module';
import { AiModule } from './API/modules/ai.module';
import { ProfileModule } from './API/modules/profile.module';
import { TransactionModule } from './API/modules/transaction.module';
import { WishlistModule } from './API/modules/wishlist.module';
import { CouponModule } from './API/modules/coupon.module';
import { AttributeModule } from './API/modules/attribute.module';
import { SpecialistModule } from './API/modules/specialist.module';
import { SpecialistDocumentModule } from './API/modules/specialist-document.module';
import { VendorDocumentModule } from './API/modules/vendor-document.module';
import { NotificationModule } from './API/modules/notification.module';
import { ChatModule } from './API/modules/chat.module';
import { MailModule } from './infrastructure/messaging/mail/mail.module';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module'; // Rule 7: Vital for database sync
import { SharedModule } from './shared/shared.module';
import { WalletModule } from './API/modules/wallet.module';
import { SeedModule } from './API/modules/seed.module';
import { CleanupModule } from './API/modules/cleanup.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LiveKitModule } from './API/modules/livekit.module';
import { OrganizationModule } from './API/modules/organization.module';

@Module({
  imports: [
    // 🌍 Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ⏰ Scheduling
    ScheduleModule.forRoot(),

    // 🛡️ Security: Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, 
        limit: 100, 
      },
    ]),

    // 🔐 Identity: JWT Configuration (Rule 7: Synced with your secret keys)
    JwtModule.registerAsync({
      global: true, // Rule 7: Ensures JwtAuthGuard works across all modules
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Increased from 15m for smoother UX in 2026
      }),
      inject: [ConfigService],
    }),

    // 🧱 Database & Infrastructure
    PrismaModule, // Rule 7: Added to ensure services can save AI and Transaction data
    MailModule,
    SharedModule,

    // 👥 Identity & User Management
    UserModule,
    AdminModule,
    VendorModule,
    OrganizationModule, // Added Organization Module
    ProfileModule,
    SpecialistModule,
    SpecialistDocumentModule,
    VendorDocumentModule,

    // 🛍️ Marketplace & Commerce
    ProductModule,
    CategoryModule,
    OrderModule,
    CartModule,
    WishlistModule,
    CouponModule,
    AttributeModule,

    // 🔬 Clinical & AI Intelligence (The Heart of AfriDam)
    AppointmentModule,
    SubscriptionModule,
    ConsultationModule,
    AnalyzerModule,
    AiModule,
    ChatModule,
    NotificationModule,

    // 💳 Financials
    TransactionModule,
    PricingPlanModule,
    InvoiceModule,
    WalletModule,
    SeedModule,
    CleanupModule,
    LiveKitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware configuration can be added here if needed in the future.
  }
}