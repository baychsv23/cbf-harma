// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import { ArticleStatus, ArticleType } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { Article } from "@/lib/interface";
import { Metadata } from "next";

// Helper stays the same
const getCategoryFromType = (type?: string) => {
    if (!type || type.length === 0) return "ALL";
    const path = type;
    console.log(path)
    if (path === "news") return ArticleType.NEWS;
    if (path === "activities") return ArticleType.ACTIVITY;
    if (path === "health-knowledge") return ArticleType.HEALTH_KNOWLEDGE;
    return "ALL";
};

export async function generateMetadata({ params }: { params: Promise<{ type?: string }> }): Promise<Metadata> {
    const { type } = await params;
    const category = getCategoryFromType(type);
    const title = category === "ALL" ? "All Articles" : `${category.replace("_", " ")} Articles`;
    return { title: `${title} | CBF` };
}

export default async function ArticlesPage({
    params
}: {
    params: Promise<{ type?: string }>
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
        select: {
            id: true,
            slug: true,
            titleLA: true,
            titleEN: true,
            contentLA: true,
            contentEN: true,
            coverImage: true,
            type: true,
            views: true,
            products: { select: { id: true, nameEN: true, nameLA: true } },
        }
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <ArticleFeed
                initialArticles={data as unknown as Article[]}
                totalArticles={total} // Pass total count to calculate hasMore
                currentType={typeEnum}
                limit={LIMIT}
            />
        </main>
    );
}