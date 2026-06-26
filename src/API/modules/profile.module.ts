import { Module } from '@nestjs/common';
import { ProfileController } from '../controllers/profile.controller';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { ProfileService } from 'src/domain/services/profile.service';
import { PrismaProfileRepository } from 'src/infrastructure/persistence/prisma/prisma-profile.repository';

import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [ProfileController],
  providers: [ProfileService, 
    {
      provide: 'IProfileRepository',
      useClass: PrismaProfileRepository
    }
  ],
  exports: [ProfileService],
})
export class ProfileModule {}