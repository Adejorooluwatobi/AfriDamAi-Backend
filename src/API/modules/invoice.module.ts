import { Module } from '@nestjs/common';
import { InvoiceController } from 'src/API/controllers/invoice.controller';
import { InvoiceService } from 'src/domain/services/invoice.service';
import { PrismaInvoiceRepository } from 'src/infrastructure/persistence/prisma/prisma-invoice.repository';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [InvoiceController],
    providers: [
        InvoiceService,
        {
            provide: 'IInvoiceRepository',
            useClass: PrismaInvoiceRepository,
        },
    ],
    exports: [InvoiceService],
})
export class InvoiceModule { }
