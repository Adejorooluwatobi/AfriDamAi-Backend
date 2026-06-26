import { Module } from '@nestjs/common';
import { CouponController } from '../controllers/coupon.controller';
import { CouponService } from 'src/domain/services/coupon.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaCouponRepository } from 'src/infrastructure/persistence/prisma/prisma-coupon.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: 'ICouponeRepository',
      useClass: PrismaCouponRepository,
    },
  ],
  exports: [CouponService],
})
export class CouponModule {}