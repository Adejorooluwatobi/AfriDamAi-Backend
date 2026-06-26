import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiService } from 'src/domain/services/ai.service';
import { AiController } from '../controllers/ai.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/prisma-user.repository';
import { PrismaProfileRepository } from 'src/infrastructure/persistence/prisma/prisma-profile.repository';

@Module({
  imports: [HttpModule, SharedModule, PrismaModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository
    },
    {
      provide: 'IProfileRepository',
      useClass: PrismaProfileRepository
    }
  ],
  exports: [AiService],
})
export class AiModule {}
