import { Module } from '@nestjs/common';
import { ConsultationController } from '../controllers/consultation.controller';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { ConsultationService } from 'src/domain/services/consultation.service';
import { PrismaConsultationRepository } from 'src/infrastructure/persistence/prisma/prisma-consultation.repository';

import { AdminModule } from './admin.module';
import { NotificationModule } from './notification.module';

@Module({
  imports: [PrismaModule, AdminModule, NotificationModule],
  controllers: [ConsultationController],
  providers: [ConsultationService, 
    {
      provide: 'ConsultationRepositoryInterface',
      useClass: PrismaConsultationRepository
    }
  ],
  exports: [ConsultationService],
})
export class ConsultationModule {}