import { Module } from '@nestjs/common';
import { CleanupService } from 'src/domain/services/cleanup.service';
import { OrderModule } from './order.module';
import { TransactionModule } from './transaction.module';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [OrderModule, TransactionModule, PrismaModule],
  providers: [CleanupService],
})
export class CleanupModule {}
