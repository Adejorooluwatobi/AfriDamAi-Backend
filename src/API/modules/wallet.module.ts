import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { WalletService } from 'src/domain/services/wallet.service';
import { WalletTransactionService } from 'src/domain/services/wallet-transaction.service';
import { WithdrawalRequestService } from 'src/domain/services/withdrawal-request.service';
import { PrismaWalletRepository } from 'src/infrastructure/persistence/prisma/prisma-wallet.repository';
import { PrismaWalletTransactionRepository } from 'src/infrastructure/persistence/prisma/prisma-wallet-transaction.repository';
import { PrismaWithdrawalRequestRepository } from 'src/infrastructure/persistence/prisma/prisma-withdrawal-request.repository';
import { NotificationModule } from './notification.module';
import { AdminModule } from './admin.module';
import { UserModule } from './user.module';
import { VendorModule } from './vendor.module';
import { SpecialistModule } from './specialist.module';
import { WalletController } from '../controllers/wallet.controller';
import { WithdrawalController } from '../controllers/withdrawal.controller';
import { AdminWithdrawalController } from '../controllers/admin-withdrawal.controller';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    AdminModule,
    forwardRef(() => UserModule),
    forwardRef(() => VendorModule),
    forwardRef(() => SpecialistModule),
  ],
  controllers: [
    WalletController,
    WithdrawalController,
    AdminWithdrawalController,
  ],
  providers: [
    WalletService,
    WalletTransactionService,
    WithdrawalRequestService,
    {
      provide: 'IWalletRepository',
      useClass: PrismaWalletRepository,
    },
    {
      provide: 'IWalletTransactionRepository',
      useClass: PrismaWalletTransactionRepository,
    },
    {
      provide: 'IWithdrawalRequestRepository',
      useClass: PrismaWithdrawalRequestRepository,
    },
  ],
  exports: [
    WalletService,
    WalletTransactionService,
    WithdrawalRequestService,
  ],
})
export class WalletModule {}
