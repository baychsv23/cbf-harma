// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import ProductFeed from "@/components/UI/Card/ProductFeed";
import { BooleanState } from "@/generated/prisma/enums";
import { getProducts } from "@/lib/getData";
import { ProductCBF } from "@/lib/interface";
import { selectDataOfProduct } from "@/lib/selectData";
import { DEFAULT_LIMIT } from "@/lib/utils/pagination";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "All Products";
  return { title: `${title} | CBF` };
}

export default async function ProductCBFPage() {
  const where: any = { isActive: BooleanState.TRUE };

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
        currentCategory={"ALL"}
        limit={DEFAULT_LIMIT}
      />
    </main>
  );
}
