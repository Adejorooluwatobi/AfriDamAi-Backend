/*
  Warnings:

  - A unique constraint covering the columns `[paystackPlanCode]` on the table `PricingPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gatewaySubscriptionId]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PricingPlan" ADD COLUMN     "paystackPlanCode" TEXT;

-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "gatewaySubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_paystackPlanCode_key" ON "PricingPlan"("paystackPlanCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_gatewaySubscriptionId_key" ON "UserSubscription"("gatewaySubscriptionId");
