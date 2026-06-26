import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { SpecialistDocumentService } from 'src/domain/services/specialist-document.service';
import { SpecialistDocumentController } from 'src/API/controllers/specialist-document.controller';
import { PrismaSpecialistDocumentRepository } from 'src/infrastructure/repositories/prisma-specialist-document.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialistDocumentController],
  providers: [
    SpecialistDocumentService,
    {
      provide: 'ISpecialistDocumentRepository',
      useClass: PrismaSpecialistDocumentRepository,
    },
  ],
  exports: [SpecialistDocumentService],
})
export class SpecialistDocumentModule {}
