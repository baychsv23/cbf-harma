// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import { ArticleStatus, BooleanState } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { ArticleCBF } from "@/lib/interface";
import { database } from "@/lib/prisma";
import { selectDataOfArticle } from "@/lib/selectData";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/utils/pagination";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "All Articles";
  return { title: `${title} | CBF` };
}

export const revalidate = 3600;

export default async function ArticlesCBFPage() {
  // ✅ LIMIT: Set to 6 or 9 to enable "Load More" functionality
  const { data, total } = await getArticles({
    where: {
      status: ArticleStatus.PUBLISHED,
    },
    skip: 0,
    limit: DEFAULT_LIMIT,
    orderBy: { publishedAt: "desc" },
    select: selectDataOfArticle,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleFeed
        initialArticles={data as ArticleCBF[]}
        totalArticles={total} // Pass total count to calculate hasMore
        currentType={"ALL"}
        limit={DEFAULT_LIMIT}
      />
    </main>
  );
}
