import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPricingPlanRepository } from '../../infrastructure/persistence/prisma/prisma-pricing-plan.repository';
import { PricingPlanController } from '../controllers/pricing-plan.controller';
import { PricingPlanService } from 'src/domain/services/pricing-plan.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [PricingPlanController],
  providers: [
    PricingPlanService,
    {
      provide: 'IPricingPlanRepository',
      useClass: PrismaPricingPlanRepository,
    },
  ],
  exports: [PricingPlanService, 'IPricingPlanRepository'],
})
export class PricingPlanModule {}
