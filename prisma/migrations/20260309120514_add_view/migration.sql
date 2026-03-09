/*
  Warnings:

  - The values [USER_VIEW,USER_CREATE,USER_UPDATE,USER_DELETE] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'ARTICLE_VIEW', 'ARTICLE_CREATE', 'ARTICLE_UPDATE', 'ARTICLE_DELETE', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_DELETE', 'SYMPTOM_VIEW', 'SYMPTOM_CREATE', 'SYMPTOM_UPDATE', 'SYMPTOM_DELETE');
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "public"."Permission_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
