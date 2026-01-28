// app/[locale]/cbf/articles/[[...type]]/page.tsx
import ArticleFeed from "@/components/UI/Card/ArticleFeed";
import { ArticleStatus, ArticleType } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { Article } from "@/lib/interface";
import { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
    const title = "All Articles";
    return { title: `${title} | CBF` };
}

export default async function ArticlesPage() {

    const where: any = { status: ArticleStatus.PUBLISHED };

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
                currentType={"ALL"}
                limit={LIMIT}
            />
        </main>
    );
}