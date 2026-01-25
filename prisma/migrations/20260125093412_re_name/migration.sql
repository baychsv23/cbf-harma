/*
  Warnings:

  - The values [ANTIDIABETIC] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `indicationEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `indicationLa` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('NUTRITION_ELECTROLYTE', 'ANTIBIOTICS', 'ANTI_PARASITIC', 'GASTROINTESTINAL', 'CARDIOVASCULAR', 'ANTI_DIABETIC', 'RESPIRATORY', 'ANTI_ALLERGIC', 'EFFECTIVE_TO_PSYCHOTIC', 'ANESTHETICS', 'ANALGESIC_ANTIPYRETIC', 'VITAMINS_MINERALS', 'DISINFECTANTS_ANTISEPTIC', 'OTHERS');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "indicationEn",
DROP COLUMN "indicationLa",
ADD COLUMN     "indicationEN" TEXT,
ADD COLUMN     "indicationLA" TEXT;
