-- CreateEnum
CREATE TYPE "SpecialistAssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN     "completedAppointments" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SpecialistAssignment" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "status" "SpecialistAssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialistAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpecialistAssignment_appointmentId_idx" ON "SpecialistAssignment"("appointmentId");

-- CreateIndex
CREATE INDEX "SpecialistAssignment_specialistId_idx" ON "SpecialistAssignment"("specialistId");

-- CreateIndex
CREATE INDEX "SpecialistAssignment_status_idx" ON "SpecialistAssignment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialistAssignment_appointmentId_specialistId_key" ON "SpecialistAssignment"("appointmentId", "specialistId");

-- AddForeignKey
ALTER TABLE "SpecialistAssignment" ADD CONSTRAINT "SpecialistAssignment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistAssignment" ADD CONSTRAINT "SpecialistAssignment_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistAssignment" ADD CONSTRAINT "SpecialistAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
