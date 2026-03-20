"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, X, Loader2 } from "lucide-react"; // Added Loader2 for loading state
import { ArticleCBF } from "@/lib/interface";
import ArticleCard from "./ArticleCard";
import { ArticleType } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";

import { TYPE_SLUG_MAP } from "@/lib/constant";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

interface ArticleFeedProps {
  initialArticles: ArticleCBF[];
  totalArticles: number;
  currentType: string;
  limit: number;
}

export default function ArticleFeed({
  initialArticles,
  totalArticles,
  currentType,
  limit,
}: ArticleFeedProps) {
  const t = useTranslations();
  const api = useApiWithAlert();

  // State
  const [articles, setArticles] = useState<ArticleCBF[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state for better UX
  const [hasMore, setHasMore] = useState(
    initialArticles.length < totalArticles,
  );

  // Helper: Generate Link Paths
  const getTypePath = (type: ArticleType | "ALL") => {
    if (type === "ALL") return "/cbf/articles";
    const slug = TYPE_SLUG_MAP[type];
    return slug ? `/cbf/articles/${slug}` : "/cbf/articles";
  };

  // ✅ Function to Fetch Articles (API)
  const fetchArticles = async (
    pageParam: number,
    searchParam: string,
    shouldAppend: boolean,
  ) => {
    setIsLoading(true);
    const params: any = {
      page: pageParam,
      limit: limit,
    };

    if (currentType !== "ALL") params.type = currentType;
    if (searchParam) params.title = searchParam;

    try {
      const { data } = await api.get("/api/articles/list", { params });

      if (data.success) {
        const newArticles = data.data;
        const pagination = data.pagination;

        if (shouldAppend) {
          setArticles((prev) =>
            shouldAppend ? [...prev, ...data.data] : data.data,
          );
        } else {
          setArticles(newArticles);
        }
        setHasMore(pagination.hasNext);
      }
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, searchQuery, true);
  };

  const handleSearchClick = () => {
    setPage(1);
    fetchArticles(1, searchQuery, false);
  };

  useEffect(() => {
    setArticles(initialArticles);
    setPage(1);
    setHasMore(initialArticles.length < totalArticles);
    setSearchQuery("");
  }, [initialArticles, totalArticles, currentType]);

  return (
    // Reduced vertical padding on mobile (py-6) vs desktop (md:py-12)
    <section className="py-6 md:py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* --- Header & Search --- */}
        <div className="flex flex-col gap-4 mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
            {t(translations.article)}
          </h1>

          {/* Compact Search Wrapper */}
          <div className="flex items-center gap-2 w-full max-w-md mx-auto md:mx-0">
            {/* Note: I kept your structure but made the wrapper full width on mobile */}
            <div className="relative w-full md:w-80 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder={t(translations.SearchBy, {
                    name: t(translations.Name, { name: t(translations.title) }),
                  })}
                  // Adjusted padding and font size for cleaner mobile look
                  className="block w-full pl-9 pr-9 py-2 md:py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPage(1);
                      fetchArticles(1, "", false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={handleSearchClick}
                className="px-4 py-2 md:px-5 md:py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition shrink-0"
              >
                <Search size={16} className="md:w-4.5 md:h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- Filter Tabs (Horizontal Scroll) --- */}
        {/* Mobile: overflow-x-auto allows scrolling left/right. 
                    no-scrollbar hides the ugly bar.
                    -mx-4 px-4 allows items to scroll to the very edge of the screen.
                */}
        <div className="flex overflow-x-auto pb-2 md:pb-4 mb-6 md:mb-8 border-b border-gray-200 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap gap-2">
          <Link
            href="/cbf/articles"
            className={`whitespace-nowrap px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
              currentType === "ALL"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {t(translations.All, { name: "" })}
          </Link>
          {Object.entries(ArticleType).map(([key, value]) => {
            const isActive = currentType === value;
            return (
              <Link
                key={value}
                href={getTypePath(value)}
                className={`whitespace-nowrap px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>

        {/* --- Article Grid --- */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {articles.map((article, index) => (
                <div key={index} className="h-full">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* --- Load More Button --- */}
            {hasMore && (
              <div className="mt-8 md:mt-12 text-center pb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    t(translations.more)
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Filter className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {t(translations.notFound)}
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
                fetchArticles(1, "", false);
              }}
              className="mt-4 text-primary-500 font-medium hover:underline text-sm md:text-base"
            >
              {t(translations.clear)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
