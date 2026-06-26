import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaAdminRepository } from './prisma-admin.repository';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaProfileRepository } from './prisma-profile.repository';
import { PrismaAnalyzerRepository } from './prisma-analyzer.repository';
import { PrismaCategoryRepository } from './prisma-category.repository';
import { PrismaProductRepository } from './prisma-product.repository';
import { PrismaProductAttributeRepository } from './prisma-product-attribute.repository';
import { PrismaCouponRepository } from './prisma-coupon.repository';
import { PrismaVendorRepository } from './prisma-vendor.repository';
import { PrismaWishlistRepository } from './prisma-wishlist.repository';
import { PrismaAttributeRepository } from './prisma-attribute.repository';
import { PrismaAttributeValueRepository } from './prisma-attribute-value.repository';
import { PrismaCartRepository } from './prisma-cart.repository';
import { PrismaConsultationRepository } from './prisma-consultation.repository';
// 🛡️ Added missing Payment and Medical Repositories
import { PrismaOrderRepository } from './prisma-order.repository';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaInvoiceRepository } from './prisma-invoice.repository';
import { PrismaAppointmentRepository } from './prisma-appointment.repository';
import { PrismaPricingPlanRepository } from './prisma-pricing-plan.repository';
import { PrismaEmailVerificationRepository } from './prisma-email-verification.repository';

@Module({
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaAdminRepository,
    PrismaCouponRepository,
    PrismaVendorRepository,
    PrismaProfileRepository,
    PrismaAnalyzerRepository,
    PrismaCategoryRepository,
    PrismaProductRepository,
    PrismaProductAttributeRepository,
    PrismaWishlistRepository,
    PrismaAttributeRepository,
    PrismaAttributeValueRepository,
    PrismaCartRepository,
    PrismaConsultationRepository,
    // 🚀 Registering the new logic
    PrismaOrderRepository,
    PrismaTransactionRepository,
    PrismaInvoiceRepository,
    PrismaAppointmentRepository,
    PrismaPricingPlanRepository,
    PrismaEmailVerificationRepository,
  ],
  exports: [
    PrismaService,
    PrismaUserRepository,
    PrismaAdminRepository,
    PrismaCouponRepository,
    PrismaVendorRepository,
    PrismaProfileRepository,
    PrismaAnalyzerRepository,
    PrismaCategoryRepository,
    PrismaProductRepository,
    PrismaProductAttributeRepository,
    PrismaWishlistRepository,
    PrismaAttributeRepository,
    PrismaAttributeValueRepository,
    PrismaCartRepository,
    PrismaConsultationRepository,
    // 🚀 Exporting so other modules can use them
    PrismaOrderRepository,
    PrismaTransactionRepository,
    PrismaInvoiceRepository,
    PrismaAppointmentRepository,
    PrismaPricingPlanRepository,
    PrismaEmailVerificationRepository,
  ],
})
export class PrismaModule {}