-- 1. Convert Enum to Text but allow it to be temporary NULL to fix data
ALTER TABLE "PricingPlan" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;

-- 2. Update any NULL values to a default string so the 'NOT NULL' constraint doesn't fail
-- You can change 'DEFAULT_PLAN' to whatever you want existing empty plans to be called
UPDATE "PricingPlan" SET "type" = 'DEFAULT_PLAN' WHERE "type" IS NULL;

-- 3. Now that there are no more NULLs, safely set the column to NOT NULL
ALTER TABLE "PricingPlan" ALTER COLUMN "type" SET NOT NULL;