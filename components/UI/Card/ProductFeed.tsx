"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Filter, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Category } from "@/generated/prisma/enums";
import { ProductCBF } from "@/lib/interface";
import { translations } from "@/lib/translation";
import { CATEGORY_SLUG_MAP } from "@/lib/constant";
import ProductCard from "./ProductCard";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

interface ProductFeedProps {
  initialProducts: ProductCBF[];
  totalProducts: number;
  currentCategory: string;
  limit: number;
}

export default function ProductFeed({
  initialProducts,
  totalProducts,
  currentCategory,
  limit,
}: ProductFeedProps) {
  const t = useTranslations();
  const api = useApiWithAlert();
  const [products, setProducts] = useState<ProductCBF[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(
    initialProducts.length < totalProducts,
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (
    pageParam: number,
    searchParam: string,
    shouldAppend: boolean,
  ) => {
    setIsLoading(true);
    const params: any = { page: pageParam, limit: limit };
    if (currentCategory !== "ALL") params.category = currentCategory;
    if (searchParam) params.name = searchParam;
    try {
      const { data } = await api.get("/api/products/list", { params });
      if (data.success) {
        setProducts((prev) =>
          shouldAppend ? [...prev, ...data.data] : data.data,
        );

        setHasMore(data.pagination.hasNext);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, searchQuery, true);
  };

  const handleSearchClick = () => {
    setPage(1);
    fetchProducts(1, searchQuery, false);
  };

  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length < totalProducts);
    setSearchQuery("");
  }, [initialProducts, totalProducts, currentCategory]);

  const getCategoryPath = (cat: Category | "ALL") => {
    if (cat === "ALL") return "/cbf/products";
    const slug = CATEGORY_SLUG_MAP[cat];
    return slug ? `/cbf/products/${slug}` : "/cbf/products";
  };

  return (
    <section className="py-6 md:py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* --- Header & Search --- */}
        <div className="flex flex-col gap-4 mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
            {t(translations.product)}
          </h1>

          {/* Compact Search Wrapper */}
          <div className="flex items-center gap-2 w-full max-w-md mx-auto md:mx-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t(translations.SearchBy, {
                  name: t(translations.Name, { name: t(translations.product) }),
                })}
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchProducts(1, "", false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearchClick}
              className="px-4 py-2 md:px-5 md:py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition shrink-0"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* --- Category Tabs (Horizontal Scroll on Mobile) --- */}
        <div className="flex overflow-x-auto pb-4 mb-6 no-scrollbar -mx-4 px-4 gap-2 border-b border-gray-100">
          <Link
            href="/cbf/products"
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
              currentCategory === "ALL"
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {t(translations.All, { name: "" })}
          </Link>
          {Object.values(Category).map((cat) => (
            <Link
              key={cat}
              href={getCategoryPath(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                currentCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t(cat)}
            </Link>
          ))}
        </div>

        {/* --- Product Grid --- */}
        {products.length > 0 ? (
          <div className="flex flex-col gap-8">
            {/* Grid adjusts from 2 columns on small mobile to 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.map((product, index) => (
                <div key={index}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center pb-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Filter className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t(translations.notFound)}
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchProducts(1, "", false);
              }}
              className="mt-2 text-primary text-sm font-medium hover:underline"
            >
              {t(translations.clear)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
