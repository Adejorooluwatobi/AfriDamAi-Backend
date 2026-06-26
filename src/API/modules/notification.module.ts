import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { NotificationService } from 'src/domain/services/notification.service';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationRepository } from 'src/infrastructure/persistence/prisma/prisma-notification.repository';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
