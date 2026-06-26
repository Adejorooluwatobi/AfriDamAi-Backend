-- AlterTable
ALTER TABLE "User" ADD COLUMN "currentPricingPlanId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentPricingPlanId_fkey" FOREIGN KEY ("currentPricingPlanId") REFERENCES "PricingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
