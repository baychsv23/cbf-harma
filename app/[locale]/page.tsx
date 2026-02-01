import BannerSection from "@/components/UI/BannerSection";
import ArticleCard from "@/components/UI/Card/ArticleCard";
import { ArticleCBF } from "@/lib/interface";
import { getArticles } from "@/lib/getData";
import { ArticleStatus } from "@/generated/prisma/enums";
import { selectDataOfArticle } from "@/lib/selectData";
import { DEFAULT_LIMIT } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";

// ฟังก์ชันดึงข้อมูลด้วย Axios

export default async function Home() {
  // เรียกใช้ฟังก์ชัน (ทำงานฝั่ง Server)
  const where: any = { status: ArticleStatus.PUBLISHED };
  const t = await getTranslations();

  // ✅ LIMIT: Set to 6 or 9 to enable "Load More" functionality

  const { data: articles } = await getArticles({
    where,
    skip: 0,
    limit: DEFAULT_LIMIT,
    select: selectDataOfArticle
  });
  return (
    <main className="min-h-screen bg-gray-50/30 pb-20">
      {/* 1. Banner Section */}
      <div className="pt-6">
        <BannerSection />
      </div>

      {/* 2. Latest Updates Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{t(translations.latestUpdate)}</h2>
            <p className="text-gray-500 mt-1">

            </p>
          </div>
          <Link
            href="/cbf/articles"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            {t(translations.All, { name: t(translations.view) })} →
          </Link>
        </div>

        {/* Content Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(articles as ArticleCBF[]).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">{t(translations.notFound)}</p>
          </div>
        )}

        {/* Mobile Button */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/cbf/articles"
            className="inline-block w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary shadow-lg"
          >
            {t(translations.latestUpdate)}
          </Link>
        </div>
      </div>
    </main>
  );
}
