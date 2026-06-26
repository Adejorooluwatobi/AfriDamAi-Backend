import { Module } from '@nestjs/common';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../../domain/services/organization.service';
import { PrismaOrganizationRepository } from '../../infrastructure/persistence/prisma/prisma-organization.repository';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

import { SpecialistModule } from './specialist.module';
import { AppointmentModule } from './appointment.module';
import { AdminModule } from './admin.module';

@Module({
  imports: [SpecialistModule, AppointmentModule, AdminModule],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    PrismaService,
    {
      provide: 'IOrganizationRepository',
      useClass: PrismaOrganizationRepository,
    },
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
