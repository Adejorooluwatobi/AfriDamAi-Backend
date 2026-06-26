-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN "password" TEXT,
ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
