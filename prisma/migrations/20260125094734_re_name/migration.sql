/*
  Warnings:

  - You are about to drop the column `contentEn` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `contentLa` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `titleLa` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `Symptom` table. All the data in the column will be lost.
  - You are about to drop the column `nameLa` on the `Symptom` table. All the data in the column will be lost.
  - Added the required column `contentEN` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentLA` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEN` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleLA` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEN` to the `Symptom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameLA` to the `Symptom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "contentEn",
DROP COLUMN "contentLa",
DROP COLUMN "titleEn",
DROP COLUMN "titleLa",
ADD COLUMN     "contentEN" TEXT NOT NULL,
ADD COLUMN     "contentLA" TEXT NOT NULL,
ADD COLUMN     "titleEN" TEXT NOT NULL,
ADD COLUMN     "titleLA" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "nameEn",
DROP COLUMN "nameLa",
ADD COLUMN     "nameEN" TEXT NOT NULL,
ADD COLUMN     "nameLA" TEXT NOT NULL;
