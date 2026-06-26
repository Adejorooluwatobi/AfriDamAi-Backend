-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "endRequestedAt" TIMESTAMP(3),
ADD COLUMN     "endRequestedBy" TEXT,
ADD COLUMN     "isExtended" BOOLEAN NOT NULL DEFAULT false;
