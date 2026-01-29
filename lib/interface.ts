import { BooleanState, Category, CategorySub } from "@/generated/prisma/enums";

export interface ArticleCBF {
  id: string; // หรือ number ตาม database ของคุณ
  titleEN: string;
  titleLA: string;
  contentEN?: string;
  contentLA?: string;
  coverImage?: string; // ถ้ามี field รูปภาพ
  type: string;
  slug: string;
  status: string;
  createdAt: Date | string;
  views: number;
  products?: { id: string; nameEN: string; nameLA: string, productImage?: string }[];
}

export interface ProductCBF {
  id: string
  slug: string
  category: Category
  categorySub: CategorySub
  productImage?: string
  sku: string
  nameEN: string
  nameLA: string
  genericName?: string
  dosage?: string
  packaging?: string
  indicationLA?: string
  indicationEN?: string
  isPrescription: BooleanState
  symptoms?: { nameLA: string, nameEN: string }
}