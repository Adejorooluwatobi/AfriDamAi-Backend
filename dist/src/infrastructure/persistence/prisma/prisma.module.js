"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const prisma_admin_repository_1 = require("./prisma-admin.repository");
const prisma_user_repository_1 = require("./prisma-user.repository");
const prisma_profile_repository_1 = require("./prisma-profile.repository");
const prisma_analyzer_repository_1 = require("./prisma-analyzer.repository");
const prisma_category_repository_1 = require("./prisma-category.repository");
const prisma_product_repository_1 = require("./prisma-product.repository");
const prisma_product_attribute_repository_1 = require("./prisma-product-attribute.repository");
const prisma_coupon_repository_1 = require("./prisma-coupon.repository");
const prisma_vendor_repository_1 = require("./prisma-vendor.repository");
const prisma_wishlist_repository_1 = require("./prisma-wishlist.repository");
const prisma_attribute_repository_1 = require("./prisma-attribute.repository");
const prisma_attribute_value_repository_1 = require("./prisma-attribute-value.repository");
const prisma_cart_repository_1 = require("./prisma-cart.repository");
const prisma_consultation_repository_1 = require("./prisma-consultation.repository");
const prisma_order_repository_1 = require("./prisma-order.repository");
const prisma_transaction_repository_1 = require("./prisma-transaction.repository");
const prisma_invoice_repository_1 = require("./prisma-invoice.repository");
const prisma_appointment_repository_1 = require("./prisma-appointment.repository");
const prisma_pricing_plan_repository_1 = require("./prisma-pricing-plan.repository");
const prisma_email_verification_repository_1 = require("./prisma-email-verification.repository");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            prisma_user_repository_1.PrismaUserRepository,
            prisma_admin_repository_1.PrismaAdminRepository,
            prisma_coupon_repository_1.PrismaCouponRepository,
            prisma_vendor_repository_1.PrismaVendorRepository,
            prisma_profile_repository_1.PrismaProfileRepository,
            prisma_analyzer_repository_1.PrismaAnalyzerRepository,
            prisma_category_repository_1.PrismaCategoryRepository,
            prisma_product_repository_1.PrismaProductRepository,
            prisma_product_attribute_repository_1.PrismaProductAttributeRepository,
            prisma_wishlist_repository_1.PrismaWishlistRepository,
            prisma_attribute_repository_1.PrismaAttributeRepository,
            prisma_attribute_value_repository_1.PrismaAttributeValueRepository,
            prisma_cart_repository_1.PrismaCartRepository,
            prisma_consultation_repository_1.PrismaConsultationRepository,
            prisma_order_repository_1.PrismaOrderRepository,
            prisma_transaction_repository_1.PrismaTransactionRepository,
            prisma_invoice_repository_1.PrismaInvoiceRepository,
            prisma_appointment_repository_1.PrismaAppointmentRepository,
            prisma_pricing_plan_repository_1.PrismaPricingPlanRepository,
            prisma_email_verification_repository_1.PrismaEmailVerificationRepository,
        ],
        exports: [
            prisma_service_1.PrismaService,
            prisma_user_repository_1.PrismaUserRepository,
            prisma_admin_repository_1.PrismaAdminRepository,
            prisma_coupon_repository_1.PrismaCouponRepository,
            prisma_vendor_repository_1.PrismaVendorRepository,
            prisma_profile_repository_1.PrismaProfileRepository,
            prisma_analyzer_repository_1.PrismaAnalyzerRepository,
            prisma_category_repository_1.PrismaCategoryRepository,
            prisma_product_repository_1.PrismaProductRepository,
            prisma_product_attribute_repository_1.PrismaProductAttributeRepository,
            prisma_wishlist_repository_1.PrismaWishlistRepository,
            prisma_attribute_repository_1.PrismaAttributeRepository,
            prisma_attribute_value_repository_1.PrismaAttributeValueRepository,
            prisma_cart_repository_1.PrismaCartRepository,
            prisma_consultation_repository_1.PrismaConsultationRepository,
            prisma_order_repository_1.PrismaOrderRepository,
            prisma_transaction_repository_1.PrismaTransactionRepository,
            prisma_invoice_repository_1.PrismaInvoiceRepository,
            prisma_appointment_repository_1.PrismaAppointmentRepository,
            prisma_pricing_plan_repository_1.PrismaPricingPlanRepository,
            prisma_email_verification_repository_1.PrismaEmailVerificationRepository,
        ],
    })
], PrismaModule);
//# sourceMappingURL=prisma.module.js.map