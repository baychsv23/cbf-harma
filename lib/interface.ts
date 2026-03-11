import {
  ArticleStatus,
  ArticleType,
  BooleanState,
  Category,
  CategorySub,
} from "@/generated/prisma/enums";

export interface ArticleCBF {
  id: string;
  titleEN: string;
  titleLA: string;
  contentEN?: string;
  contentLA?: string;
  coverImage?: string; // ถ้ามี field รูปภาพ
  type: ArticleType;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date | string;
  views: number;
  products?: {
    slug: string;
    category: Category;
    nameEN: string;
    nameLA: string;
    productImage: string;
  }[];
}

export interface ProductCBF {
  id: string;
  slug: string;
  category: Category;
  categorySub: CategorySub;
  views: number;
  productImage?: string;
  nameEN: string;
  nameLA: string;
  genericName?: string;
  dosage?: string;
  packaging?: string;
  indicationLA?: string;
  indicationEN?: string;
  isPrescription: BooleanState;
  symptoms?: { nameLA: string; nameEN: string }[];
}
