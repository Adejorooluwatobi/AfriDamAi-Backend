/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `Vendor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpecialistType" AS ENUM ('SKINCARE_CONSULTANT', 'REGISTERED_NURSE', 'MEDICAL_OFFICER', 'DERMATOLOGIST');

-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN     "type" "SpecialistType" NOT NULL DEFAULT 'SKINCARE_CONSULTANT';

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "documentUrl",
ADD COLUMN     "documentsUrl" TEXT[];
