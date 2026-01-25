/*
  Warnings:

  - You are about to drop the column `descriptionsEN` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionsLA` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "descriptionsEN",
DROP COLUMN "descriptionsLA";
