-- CreateTable
CREATE TABLE "SpecialistDocument" (
    "id" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "personalAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "licenseNumber" TEXT,
    "licenseUrl" TEXT,
    "yearsExperience" INTEGER,
    "specialization" TEXT,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bankCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialistDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorDocument" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "businessRegUrl" TEXT,
    "taxIdNumber" TEXT,
    "cacDocumentUrl" TEXT,
    "directorName" TEXT,
    "directorAddress" TEXT,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bankCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpecialistDocument_specialistId_key" ON "SpecialistDocument"("specialistId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorDocument_vendorId_key" ON "VendorDocument"("vendorId");

-- AddForeignKey
ALTER TABLE "SpecialistDocument" ADD CONSTRAINT "SpecialistDocument_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorDocument" ADD CONSTRAINT "VendorDocument_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
