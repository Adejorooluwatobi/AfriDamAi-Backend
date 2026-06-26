import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { VendorDocumentService } from 'src/domain/services/vendor-document.service';
import { VendorDocumentController } from 'src/API/controllers/vendor-document.controller';
import { PrismaVendorDocumentRepository } from 'src/infrastructure/repositories/prisma-vendor-document.repository';

@Module({
  imports: [PrismaModule],
  controllers: [VendorDocumentController],
  providers: [
    VendorDocumentService,
    {
      provide: 'IVendorDocumentRepository',
      useClass: PrismaVendorDocumentRepository,
    },
  ],
  exports: [VendorDocumentService],
})
export class VendorDocumentModule {}
