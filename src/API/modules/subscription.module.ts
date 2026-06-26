import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionCronService } from 'src/domain/services/subscription-cron.service';
import { SubscriptionController } from '../controllers/subscription.controller';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PricingPlanModule } from './pricing-plan.module';
import { AdminModule } from './admin.module';
import { SubscriptionService } from 'src/domain/services/subscription.service';
import { PrismaSubscriptionRepository } from 'src/infrastructure/persistence/prisma/prisma-subscription.repository';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/prisma-user.repository';

@Module({
  imports: [
    PrismaModule, 
    PricingPlanModule,
    AdminModule,
    ScheduleModule.forRoot()
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionCronService,
    {
      provide: 'ISubscriptionRepository',
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
