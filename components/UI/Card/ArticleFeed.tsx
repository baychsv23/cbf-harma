"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Article } from "@/lib/interface";
import { isEnglish } from "@/lib/constant";
import ArticleCard from "./ArticleCard";
import { ArticleType } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";
import axios from "axios"; // Ensure axios is installed

interface ArticleFeedProps {
    initialArticles: Article[];
    totalArticles: number; // New Prop
    currentType: string;
    limit: number; // New Prop
}

export default function ArticleFeed({ initialArticles, totalArticles, currentType, limit }: ArticleFeedProps) {
    const t = useTranslations();
    const local = useLocale();

    // State
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    // Calculate if we have more data based on current list length vs total
    // Note: This simple calculation works best for the initial load. 
    // For search, we will update 'hasMore' dynamically.
    const [hasMore, setHasMore] = useState(initialArticles.length < totalArticles);

    // Debounce Search Ref
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Helper: Generate Link Paths
    const getCategoryPath = (type: string) => {
        if (type === "ALL") return "/cbf/articles";
        switch (type) {
            case "NEWS": return "/cbf/articles/news";
            case "ACTIVITY": return "/cbf/articles/activities";
            case "HEALTH_KNOWLEDGE": return "/cbf/articles/health-knowledge";
            default: return `/cbf/articles`;
        }
    };

    // ✅ Function to Fetch Articles (API)
    const fetchArticles = async (pageParam: number, searchParam: string, shouldAppend: boolean) => {
        setLoading(true);
        try {
            const params: any = {
                page: pageParam,
                limit: limit,
                status: "PUBLISHED"
            };

            if (currentType !== "ALL") params.type = currentType;
            if (searchParam) params.title = searchParam;

            const response = await axios.get("/api/articles", { params }); // Adjust path if needed

            if (response.data.success) {
                const newArticles = response.data.data;
                const pagination = response.data.pagination;

                if (shouldAppend) {
                    setArticles((prev) => [...prev, ...newArticles]);
                } else {
                    setArticles(newArticles);
                }

                // Update hasMore based on API response
                setHasMore(pagination.hasNext);
            }
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Load More
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchArticles(nextPage, searchQuery, true);
    };

    // ✅ Handle Search (Server-Side)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        // Debounce: Wait 500ms before calling API
        searchTimeout.current = setTimeout(() => {
            setPage(1); // Reset to page 1
            fetchArticles(1, query, false); // Fetch new data, do NOT append
        }, 500);
    };

    // Reset State when Category Changes (Handled by Link navigation, but good practice)
    useEffect(() => {
        setArticles(initialArticles);
        setPage(1);
        setHasMore(initialArticles.length < totalArticles);
        setSearchQuery("");
    }, [initialArticles, totalArticles, currentType]);

    return (
        <section className="py-12 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t(translations.title)}
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t(translations.SearchBy, { name: t(translations.article) })}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white shadow-sm"
                            value={searchQuery}
                            onChange={handleSearch}
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
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                    <Link
                        href="/cbf/articles"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentType === "ALL"
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        {t(translations.All, { name: "" })}
                    </Link>
                    {Object.entries(ArticleType).map(([key, value]) => {
                        // console.log(currentType)
                        // console.log(value)
                        const isActive = currentType === value;

                        return (
                            <Link
                                key={value}
                                href={getCategoryPath(value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/25"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {t(key)}
                            </Link>
                        );
                    })}
                </div>

                {/* Article Grid */}
                {articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {articles.map((article) => (
                                <div key={article.id} className="h-full">
                                    <ArticleCard article={article} />
                                </div>
                            ))}
                        </div>

                        {/* ✅ Load More Button */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Load More Articles
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Filter className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {t(translations.notFound)}
                        </h3>
                        <p className="text-gray-500 max-w-sm mt-1">
                            No articles found matching "{searchQuery}".
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setPage(1);
                                fetchArticles(1, "", false);
                            }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}