import { Module } from '@nestjs/common';
import { SeedService } from '../../domain/services/seed.service';
import { AdminModule } from './admin.module';
import { WalletModule } from './wallet.module';

@Module({
  imports: [AdminModule, WalletModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
