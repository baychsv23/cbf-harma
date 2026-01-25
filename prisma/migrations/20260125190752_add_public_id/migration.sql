/*
  Warnings:

  - You are about to drop the column `PublicId` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "PublicId",
ADD COLUMN     "imagePublicId" TEXT;
