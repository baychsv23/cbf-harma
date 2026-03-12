import BannerSection from "@/components/UI/BannerSection";
import ArticleCard from "@/components/UI/Card/ArticleCard";
import { ArticleCBF } from "@/lib/interface";
import { getArticles } from "@/lib/getData";
import { ArticleStatus, ArticleType } from "@/generated/prisma/enums";
import { selectDataOfArticle } from "@/lib/selectData";
import { getTranslations } from "next-intl/server";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";
import { Newspaper, Megaphone, GraduationCap, ArrowRight } from "lucide-react";

// ── Section config — ปรับ ArticleType ให้ตรง enum จริงของคุณ ─────────────────
const SECTIONS = [
  {
    type: ArticleType.NEWS,
    fallbackLabel: "ข่าวสาร",
    translationKey: "NEWS",
    icon: Newspaper,
    accent: "#006b3d",
    accentLight: "#e8f4ee",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    hrefAll: "/cbf/articles?type=NEWS",
  },
  {
    type: ArticleType.ACTIVITY,
    fallbackLabel: "ประกาศ",
    translationKey: "ACTIVITY",
    icon: Megaphone,
    accent: "#b45309",
    accentLight: "#fef9ec",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    hrefAll: "/cbf/articles?type=ANNOUNCEMENT",
  },
  {
    type: ArticleType.HEALTH_KNOWLEDGE,
    fallbackLabel: "ความรู้",
    translationKey: "HEALTH_KNOWLEDGE",
    icon: GraduationCap,
    accent: "#1d4ed8",
    accentLight: "#eff4ff",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    hrefAll: "/cbf/articles?type=KNOWLEDGE",
  },
] as const;

const PER_SECTION = 3;

export default async function Home() {
  const t = await getTranslations();
  const baseWhere = { status: ArticleStatus.PUBLISHED };

  // Fetch all 3 sections in parallel
  const results = await Promise.all(
    SECTIONS.map((s) =>
      getArticles({
        where: { ...baseWhere, type: s.type },
        skip: 0,
        limit: PER_SECTION,
        select: selectDataOfArticle,
      }),
    ),
  );

  const sectionArticles = results.map((r) => (r.data ?? []) as ArticleCBF[]);

  return (
    <main className="min-h-screen pb-24">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <section className="pt-4">
        <BannerSection />
      </section>

      {/* ── 3 Article Sections ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-14">
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
                      className="mt-1 h-[3px] w-8 rounded-full"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <div key={article.id} className="relative">
                      <span
                        className={`absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${cfg.badgeClass}`}
                      >
                        {label}
                      </span>
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
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
    </main>
  );
}
