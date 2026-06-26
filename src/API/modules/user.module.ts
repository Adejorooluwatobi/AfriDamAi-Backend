import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaUserRepository } from 'src/infrastructure/persistence/prisma/prisma-user.repository';
import { UserService } from 'src/domain/services/user.service';
import { UserController } from '../controllers/user.controller';
import { CartService } from 'src/domain/services/cart.service';
import { PrismaCartRepository } from 'src/infrastructure/persistence/prisma/prisma-cart.repository';
import { WalletModule } from './wallet.module'; // Import WalletModule
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({}), forwardRef(() => WalletModule), SharedModule], // Use forwardRef
  controllers: [UserController],
  providers: [UserService,CartService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'CartRepository',
      useClass: PrismaCartRepository,
    },
  ],
  exports: [UserService, 'IUserRepository'], // Export IUserRepository
})
export class UserModule {}