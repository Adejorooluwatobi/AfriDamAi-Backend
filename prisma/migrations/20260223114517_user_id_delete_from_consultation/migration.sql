/*
  Warnings:

  - You are about to drop the column `userId` on the `Consultation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_userId_fkey";

-- DropIndex
DROP INDEX "Consultation_userId_key";

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "userId";
