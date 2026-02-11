// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import ProductFeed from "@/components/UI/Card/ProductFeed";
import {
  ArticleStatus,
  ArticleType,
  BooleanState,
  Category,
} from "@/generated/prisma/enums";
import { getProducts } from "@/lib/getData";
import { ProductCBF } from "@/lib/interface";
import { selectDataOfProduct } from "@/lib/selectData";
import { DEFAULT_LIMIT } from "@/lib/utils/pagination";
import { Metadata } from "next";

const SLUG_TO_CATEGORY_MAP: Record<string, Category> = {
  "nutrition-electrolyte": Category.NUTRITION_ELECTROLYTE,
  antibiotics: Category.ANTIBIOTICS,
  "anti-parasitic": Category.ANTI_PARASITIC,
  gastrointestinal: Category.GASTROINTESTINAL,
  cardiovascular: Category.CARDIOVASCULAR,
  "anti-diabetic": Category.ANTI_DIABETIC,
  respiratory: Category.RESPIRATORY,
  "anti-allergic": Category.ANTI_ALLERGIC,
  "effective-to-psychotic": Category.EFFECTIVE_TO_PSYCHOTIC,
  anesthetics: Category.ANESTHETICS,
  "analgesic-antipyretic": Category.ANALGESIC_ANTIPYRETIC,
  "vitamins-minerals": Category.VITAMINS_MINERALS,
  "disinfectants-antiseptic": Category.DISINFECTANTS_ANTISEPTIC,
  others: Category.OTHERS,
};
// Helper stays the same
const convertPathToCategory = (type?: string) => {
  if (!type || type.length === 0) return "ALL";

  const path = Array.isArray(type) ? type[0] : type;

  return SLUG_TO_CATEGORY_MAP[path] ?? "ALL";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const title = category === "ALL" ? "All Products" : `${category} Products`;
  return { title: `${title} | CBF` };
}

export default async function ProductsCBFWithCategoryPage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  const { category } = await params;
  const categoryEnum = convertPathToCategory(category);

  const where: any = { isActive: BooleanState.TRUE };
  if (categoryEnum !== "ALL") where.category = categoryEnum;

  // ✅ LIMIT: Set to 6 or 9 to enable "Load More" functionality

  const { data, total } = await getProducts({
    where,
    skip: 0,
    limit: DEFAULT_LIMIT,
    select: selectDataOfProduct,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <ProductFeed
        initialProducts={data as ProductCBF[]}
        totalProducts={total} // Pass total count to calculate hasMore
        currentCategory={categoryEnum}
        limit={DEFAULT_LIMIT}
      />
    </main>
  );
}
