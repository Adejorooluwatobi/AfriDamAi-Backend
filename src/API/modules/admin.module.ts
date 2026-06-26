import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from 'src/domain/services/admin.service';
import { AdminNotificationService } from 'src/domain/services/admin-notification.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaAdminRepository } from 'src/infrastructure/persistence/prisma/prisma-admin.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminNotificationService,
    {
      provide: 'IAdminRepository',
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [AdminService, AdminNotificationService, 'IAdminRepository'], // Export IAdminRepository
})
export class AdminModule {}