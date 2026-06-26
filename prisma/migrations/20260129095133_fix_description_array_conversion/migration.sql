-- 1. Convert the existing String column to a String Array column
-- This wraps existing text in an array: "Hello" becomes ["Hello"]
ALTER TABLE "PricingPlan" 
ALTER COLUMN "description" TYPE TEXT[] 
USING CASE 
    WHEN "description" IS NULL THEN '{}'::TEXT[] 
    ELSE ARRAY["description"] 
END;

-- 2. Set the default for new records to be an empty array
ALTER TABLE "PricingPlan" ALTER COLUMN "description" SET DEFAULT '{}';

-- 3. Ensure the column is NOT NULL to match your Prisma schema
-- (Only do this if your prisma schema doesn't have a '?' on description)
ALTER TABLE "PricingPlan" ALTER COLUMN "description" SET NOT NULL;