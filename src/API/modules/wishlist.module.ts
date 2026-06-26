import { Module } from '@nestjs/common';
import { WishlistController } from '../controllers/wishlist.controller';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { WishlistService } from 'src/domain/services/wishlist.service';
import { PrismaWishlistRepository } from 'src/infrastructure/persistence/prisma/prisma-wishlist.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistController],
  providers: [WishlistService, 
    {
      provide: 'IWishlistRepository',
      useClass: PrismaWishlistRepository
    }
  ],
  exports: [WishlistService],
})
export class WishlistModule {}