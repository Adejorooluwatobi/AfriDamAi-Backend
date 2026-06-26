-- Step 1: Temporarily cast the column to text to avoid enum validation issues
-- We use USING "specialty"::text to handle any existing enums
ALTER TABLE "Appointment" ALTER COLUMN "specialty" TYPE TEXT USING "specialty"::text;

-- Step 2: Map all specific specialist types back to the 'CONSULTANT' tier
UPDATE "Appointment" 
SET "specialty" = 'CONSULTANT' 
WHERE "specialty" IN ('SKINCARE_CONSULTANT', 'REGISTERED_NURSE', 'MEDICAL_OFFICER');

-- Step 3: Ensure any other non-conforming values (except DERMATOLOGIST) become 'CONSULTANT'
-- (This handles any stray data that isn't the two allowed tiers)
UPDATE "Appointment"
SET "specialty" = 'CONSULTANT'
WHERE "specialty" != 'DERMATOLOGIST' AND "specialty" != 'CONSULTANT';

-- Step 4: Change the column back to the 'SpecialtyTier' enum to match your schema
ALTER TABLE "Appointment" ALTER COLUMN "specialty" TYPE "SpecialtyTier" USING "specialty"::"SpecialtyTier";
