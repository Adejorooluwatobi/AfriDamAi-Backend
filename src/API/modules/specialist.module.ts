import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { SpecialistController } from '../controllers/specialist.controller';
import { SpecialistRepository } from 'src/infrastructure/persistence/prisma/prisma-specialist.repository';
import { WalletModule } from './wallet.module'; // Import WalletModule

@Module({
  imports: [PrismaModule, forwardRef(() => WalletModule)], // Add WalletModule
  controllers: [SpecialistController],
  providers: [
    SpecialistService,
    {
      provide: 'ISpecialistRepository',
      useClass: SpecialistRepository,
    },
  ],
  exports: [SpecialistService, 'ISpecialistRepository'], // Export ISpecialistRepository
})
export class SpecialistModule {}
