import BannerSection from "@/components/UI/BannerSection";
import ContentSlider from "@/components/UI/ContentSlider";
import ArticleCard from "@/components/UI/Card/ArticleCard";
import ProductCard from "@/components/UI/Card/ProductCard";
import { ArticleCBF, ProductCBF } from "@/lib/interface";
import { getArticles, getProducts } from "@/lib/getData";
import { ArticleStatus, ArticleType, BooleanState } from "@/generated/prisma/enums";
import { selectDataOfArticle, selectBasicDataOfProduct } from "@/lib/selectData";
import { getTranslations } from "next-intl/server";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";
import { Newspaper, Megaphone, GraduationCap, ArrowRight, TrendingUp } from "lucide-react";

// ── Section config — ปรับ ArticleType ให้ตรง enum จริงของคุณ ─────────────────
const SECTIONS = [
  {
    type: ArticleType.NEWS,
    fallbackLabel: "",
    translationKey: "NEWS",
    icon: Newspaper,
    accent: "#006b3d",
    accentLight: "#e8f4ee",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    hrefAll: "/cbf/articles/news",
  },
  {
    type: ArticleType.ACTIVITY,
    fallbackLabel: "",
    translationKey: "ACTIVITY",
    icon: Megaphone,
    accent: "#b45309",
    accentLight: "#fef9ec",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    hrefAll: "/cbf/articles/activity",
  },
  {
    type: ArticleType.HEALTH_KNOWLEDGE,
    fallbackLabel: "",
    translationKey: "HEALTH_KNOWLEDGE",
    icon: GraduationCap,
    accent: "#1d4ed8",
    accentLight: "#eff4ff",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    hrefAll: "/cbf/articles/health-knowledge",
  },
] as const;

const PER_SECTION = 5;

export const revalidate = 3600; // Cache the page for 1 hour to save Vercel CPU

export default async function Home() {
  const t = await getTranslations();
  const baseWhere = { status: ArticleStatus.PUBLISHED };

  // Fetch all 3 sections in parallel
  const articlesResultsPromise = Promise.all(
    SECTIONS.map((s) =>
      getArticles({
        where: { ...baseWhere, type: s.type },
        skip: 0,
        limit: PER_SECTION,
        orderBy: { createdAt: "desc" },
        select: selectDataOfArticle,
      }),
    ),
  );

  const topProductsPromise = getProducts({
    where: { isActive: BooleanState.TRUE },
    limit: 10,
    orderBy: { views: "desc" },
    select: selectBasicDataOfProduct,
  });

  const [results, topProductsResult] = await Promise.all([
    articlesResultsPromise,
    topProductsPromise,
  ]);

  const sectionArticles = results.map((r) => (r.data ?? []) as ArticleCBF[]);
  const topProducts = (topProductsResult?.data ?? []) as ProductCBF[];

  return (
    <main className="min-h-screen pb-24">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <section className="pt-4">
        <BannerSection />
      </section>

      {/* ── Top 10 Products ─────────────────────────────────────────── */}


      {/* ── 3 Article Sections ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {SECTIONS.map((cfg, idx) => {
          const Icon = cfg.icon;
          const articles = sectionArticles[idx];
          const label = t(cfg.translationKey);

          return (
            <section key={cfg.type}>
              {/* ── Section Header ──────────────────────────────────────── */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cfg.accentLight }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cfg.accent }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{label}</h2>
                    <div
                      className="mt-1 h-0.75 w-8 rounded-full"
                      style={{ backgroundColor: cfg.accent }}
                    />
                  </div>
                </div>

                {/* View all — desktop */}
                <Link
                  href={cfg.hrefAll}
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  {t(translations.All, { name: t(translations.view) })}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px bg-gray-200" />

              {/* ── Cards ───────────────────────────────────────────────── */}
              {articles.length > 0 ? (
                <ContentSlider
                  breakpoints={{
                    320: { slidesPerView: 1.15, spaceBetween: 16 },
                    640: { slidesPerView: 2.2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                >
                  {articles.map((article) => (
                    <div key={article.id} className="relative w-full h-full flex-1 flex flex-col">
                      <span
                        className={`absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${cfg.badgeClass}`}
                      >
                        {label}
                      </span>
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </ContentSlider>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-gray-200 bg-white">
                  <Icon className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">
                    {t(translations.noData)} {label}
                  </p>
                </div>
              )}

              {/* View all — mobile */}
              <div className="mt-5 md:hidden">
                <Link
                  href={cfg.hrefAll}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {t(translations.All, { name: t(translations.view) })}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          );
        })}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-14">
        <section>
          {/* ── Section Header ──────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#fef2f2" }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: "#dc2626" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {t(translations.top)} 10 {t(translations.product)}
                </h2>
                <div
                  className="mt-1 h-0.75 w-8 rounded-full bg-red-600"
                />
              </div>
            </div>

            {/* View all — desktop */}
            <Link
              href="/cbf/products"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              {t(translations.All, { name: t(translations.view) })}{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-gray-200" />

          {/* ── Cards ───────────────────────────────────────────────── */}
          {topProducts.length > 0 ? (
            <ContentSlider>
              {topProducts.map((product) => (
                <div key={product.id} className="relative w-full h-full flex-1 flex flex-col">
                  <ProductCard product={product} />
                </div>
              ))}
            </ContentSlider>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-gray-200 bg-white">
              <TrendingUp className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                {t(translations.noData)}
              </p>
            </div>
          )}

          {/* View all — mobile */}
          <div className="mt-5 md:hidden">
            <Link
              href="/cbf/products"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              {t(translations.All, { name: t(translations.view) })}{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
