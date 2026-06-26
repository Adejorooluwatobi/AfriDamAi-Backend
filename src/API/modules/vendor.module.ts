import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { VendorController } from '../controllers/vendor.controller';
import { VendorService } from 'src/domain/services/vendor.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaVendorRepository } from 'src/infrastructure/persistence/prisma/prisma-vendor.repository';
import { WalletModule } from './wallet.module'; // Import WalletModule

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({}), forwardRef(() => WalletModule)], // Add WalletModule
  controllers: [VendorController],
  providers: [
    VendorService,
    {
      provide: 'IVendorRepository',
      useClass: PrismaVendorRepository,
    },
  ],
  exports: [VendorService, 'IVendorRepository'], // Export IVendorRepository
})
export class VendorModule {}