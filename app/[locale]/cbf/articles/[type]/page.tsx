// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import { ArticleStatus, ArticleType } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { ArticleCBF } from "@/lib/interface";
import { selectDataOfArticle } from "@/lib/selectData";
import { Metadata } from "next";

// Helper stays the same
const getCategoryFromType = (type?: string) => {
  if (!type || type.length === 0) return "ALL";
  const path = type;
  if (path === "news") return ArticleType.NEWS;
  if (path === "activity") return ArticleType.ACTIVITY;
  if (path === "health-knowledge") return ArticleType.HEALTH_KNOWLEDGE;
  return "ALL";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const title = type === "ALL" ? "All Articles" : `${type} Articles`;
  return { title: `${title} | CBF` };
}

export default async function ArticlesCBFWithTypePage({
  params,
}: {
  params: Promise<{ type?: string }>;
}) {
  const { type } = await params;
  const typeEnum = getCategoryFromType(type);

  const where: any = { status: ArticleStatus.PUBLISHED };
  if (typeEnum !== "ALL") where.type = typeEnum;

  // ✅ LIMIT: Set to 6 or 9 to enable "Load More" functionality
  const LIMIT = 2;

  const { data, total } = await getArticles({
    where,
    skip: 0,
    limit: LIMIT,
    select: selectDataOfArticle,
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <ArticleFeed
        initialArticles={data as ArticleCBF[]}
        totalArticles={total} // Pass total count to calculate hasMore
        currentType={typeEnum}
        limit={LIMIT}
      />
    </main>
  );
}
