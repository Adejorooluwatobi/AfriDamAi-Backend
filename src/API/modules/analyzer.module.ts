import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { AnalyzerService } from 'src/domain/services/analyzer.service';
import { PrismaAnalyzerRepository } from 'src/infrastructure/persistence/prisma/prisma-analyzer.repository';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/prisma-user.repository';
import { PrismaProfileRepository } from 'src/infrastructure/persistence/prisma/prisma-profile.repository';
import { AnalyzerController } from '../controllers/analyzer.controller';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [PrismaModule, HttpModule, SharedModule],
  controllers: [AnalyzerController],
  providers: [
    AnalyzerService, 
    {
      provide: 'IAnalyzerRepository',
      useClass: PrismaAnalyzerRepository
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository
    },
    {
      provide: 'IProfileRepository',
      useClass: PrismaProfileRepository
    }
  ],
  exports: [AnalyzerService],
})
export class AnalyzerModule {}