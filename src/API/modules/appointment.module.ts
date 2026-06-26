import { Module } from '@nestjs/common';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../../domain/services/appointment.service';
import { SubscriptionValidationService } from '../../domain/services/subscription-validation.service';
import { SpecialistAssignmentService } from '../../domain/services/specialist-assignment.service';
import { TransactionModule } from './transaction.module';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { PrismaAppointmentRepository } from '../../infrastructure/persistence/prisma/prisma-appointment.repository';
import { PrismaSpecialistAssignmentRepository } from '../../infrastructure/persistence/prisma/prisma-specialist-assignment.repository';
import { PricingPlanModule } from './pricing-plan.module';
import { SubscriptionModule } from './subscription.module';
import { SharedModule } from '../../shared/shared.module';
import { NotificationModule } from './notification.module';
import { AdminModule } from './admin.module';
import { SpecialistModule } from './specialist.module';
import { WalletModule } from './wallet.module';
import { SessionCronService } from '../../domain/services/session-cron.service';

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    PricingPlanModule,
    SubscriptionModule,
    SharedModule, // Add SharedModule here
    NotificationModule, // Add NotificationModule here
    AdminModule, // Add AdminModule here
    SpecialistModule, // Add SpecialistModule here
    WalletModule,
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    SubscriptionValidationService,
    SpecialistAssignmentService,
    SessionCronService,
    {
      provide: 'IAppointmentRepository',
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: 'ISpecialistAssignmentRepository',
      useClass: PrismaSpecialistAssignmentRepository,
    },
  ],
  exports: [AppointmentService, SpecialistAssignmentService],
})
export class AppointmentModule {}