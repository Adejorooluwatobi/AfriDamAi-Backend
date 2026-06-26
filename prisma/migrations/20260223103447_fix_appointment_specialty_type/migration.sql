-- Fix: Change Appointment.specialty from SpecialtyTier to SpecialistType
-- SpecialtyTier had: DERMATOLOGIST, CONSULTANT
-- SpecialistType has: SKINCARE_CONSULTANT, REGISTERED_NURSE, MEDICAL_OFFICER, DERMATOLOGIST
-- DERMATOLOGIST maps directly; CONSULTANT maps to SKINCARE_CONSULTANT

-- Step 1: Add a temporary text column
ALTER TABLE "Appointment" ADD COLUMN "specialty_new" TEXT;

-- Step 2: Copy data with mapping
UPDATE "Appointment"
SET "specialty_new" = CASE
  WHEN "specialty"::text = 'DERMATOLOGIST' THEN 'DERMATOLOGIST'
  WHEN "specialty"::text = 'CONSULTANT'    THEN 'SKINCARE_CONSULTANT'
  ELSE 'SKINCARE_CONSULTANT'
END;

-- Step 3: Drop the old column
ALTER TABLE "Appointment" DROP COLUMN "specialty";

-- Step 4: Add the new column with SpecialistType enum
ALTER TABLE "Appointment" ADD COLUMN "specialty" "SpecialistType" NOT NULL DEFAULT 'SKINCARE_CONSULTANT';

-- Step 5: Copy from temp column
UPDATE "Appointment"
SET "specialty" = "specialty_new"::"SpecialistType";

-- Step 6: Drop temp column
ALTER TABLE "Appointment" DROP COLUMN "specialty_new";

-- Step 7: Remove the default we added temporarily
ALTER TABLE "Appointment" ALTER COLUMN "specialty" DROP DEFAULT;
