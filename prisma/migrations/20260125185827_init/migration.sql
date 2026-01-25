-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'USER');

-- CreateEnum
CREATE TYPE "ActiveState" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "BooleanState" AS ENUM ('TRUE', 'FALSE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('NUTRITION_ELECTROLYTE', 'ANTIBIOTICS', 'ANTI_PARASITIC', 'GASTROINTESTINAL', 'CARDIOVASCULAR', 'ANTI_DIABETIC', 'RESPIRATORY', 'ANTI_ALLERGIC', 'EFFECTIVE_TO_PSYCHOTIC', 'ANESTHETICS', 'ANALGESIC_ANTIPYRETIC', 'VITAMINS_MINERALS', 'DISINFECTANTS_ANTISEPTIC', 'OTHERS');

-- CreateEnum
CREATE TYPE "CategorySub" AS ENUM ('NONE', 'PENICILLINS', 'CEPHALOSPORINS', 'MACROLIDES', 'QUINOLONES', 'SULFONAMIDES', 'TINIDAZOLES', 'AMINOGLYCOSIDES');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'ARTICLE_VIEW', 'ARTICLE_CREATE', 'ARTICLE_UPDATE', 'ARTICLE_DELETE', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_DELETE', 'SYMPTOM_VIEW', 'SYMPTOM_CREATE', 'SYMPTOM_UPDATE', 'SYMPTOM_DELETE');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('BANNER', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('NEWS', 'HEALTH_KNOWLEDGE', 'ACTIVITY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "fullName" TEXT,
    "password" TEXT NOT NULL,
    "isActive" "BooleanState" NOT NULL DEFAULT 'TRUE',
    "permissions" JSONB,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "status" "ActiveState" NOT NULL DEFAULT 'ACTIVE',
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "nameLA" TEXT NOT NULL,
    "genericName" TEXT,
    "dosage" TEXT,
    "packaging" TEXT,
    "indicationLA" TEXT,
    "indicationEN" TEXT,
    "isPrescription" "BooleanState" NOT NULL DEFAULT 'FALSE',
    "isActive" "BooleanState" NOT NULL DEFAULT 'TRUE',
    "productImage" TEXT,
    "productImagePublicId" TEXT,
    "category" "Category" NOT NULL,
    "categorySub" "CategorySub" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" "ImageType" NOT NULL DEFAULT 'BANNER',
    "isActive" "BooleanState" NOT NULL DEFAULT 'TRUE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL,
    "nameLA" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleLA" TEXT NOT NULL,
    "titleEN" TEXT NOT NULL,
    "contentLA" TEXT NOT NULL,
    "contentEN" TEXT NOT NULL,
    "coverImage" TEXT,
    "type" "ArticleType" NOT NULL DEFAULT 'HEALTH_KNOWLEDGE',
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToSymptom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToSymptom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "_ProductToSymptom_B_index" ON "_ProductToSymptom"("B");

-- CreateIndex
CREATE INDEX "_ArticleToProduct_B_index" ON "_ArticleToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSymptom" ADD CONSTRAINT "_ProductToSymptom_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSymptom" ADD CONSTRAINT "_ProductToSymptom_B_fkey" FOREIGN KEY ("B") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToProduct" ADD CONSTRAINT "_ArticleToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToProduct" ADD CONSTRAINT "_ArticleToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
