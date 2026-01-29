"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import axios from "axios";
import { Category } from "@/generated/prisma/enums"; // Assuming you have this Enum generated
import { ProductCBF } from "@/lib/interface";
import { translations } from "@/lib/translation";
// import ProductCard from "./ProductCard"; // You need to create this

interface ProductFeedProps {
    initialProducts: ProductCBF[];
    totalProducts: number;
    currentCategory: string;
    limit: number;
}

export default function ProductFeed({ initialProducts, totalProducts, currentCategory, limit }: ProductFeedProps) {
    const t = useTranslations();
    const local = useLocale();

    // State
    const [products, setProducts] = useState<ProductCBF[]>(initialProducts);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasMore, setHasMore] = useState(initialProducts.length < totalProducts);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Helper: Generate Link Paths for Categories
    const getCategoryPath = (cat: string) => {
        if (cat === "ALL") return "/cbf/products";
        // Convert Enum to URL friendly slug (e.g., MEDICAL_EQUIPMENT -> medical-equipment)
        return `/cbf/products`;
    };

    // ✅ API Fetch Function
    const fetchProducts = async (pageParam: number, searchParam: string, shouldAppend: boolean) => {

        const params: any = {
            page: pageParam,
            limit: limit,
            isActive: "TRUE" // Only show active products
        };

        if (currentCategory !== "ALL") params.category = currentCategory;
        if (searchParam) params.search = searchParam;

        const response = await axios.get("/api/products/list", { params });

        if (response.data.success) {
            const newProducts = response.data.data;
            const pagination = response.data.pagination;

            if (shouldAppend) {
                setProducts((prev) => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }
            setHasMore(pagination.hasNext);
        }

    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, searchQuery, true);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            fetchProducts(1, query, false);
        }, 500);
    };

    // Reset state on category change
    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(initialProducts.length < totalProducts);
        setSearchQuery("");
    }, [initialProducts, totalProducts, currentCategory]);

    return (
        <section className="py-12 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t(translations.product)}
                        </h1>
                    </div>
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t(translations.SearchBy, { name: t(translations.Name, { name: t(translations.product) }) })}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white shadow-sm"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setPage(1);
                                    fetchProducts(1, "", false);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                    <Link
                        href="/cbf/products"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentCategory === "ALL"
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                    >
                        {t(translations.All, { name: "" })}
                    </Link>
                    {Object.values(Category).map((cat) => {
                        const isActive = currentCategory === cat;
                        return (
                            <Link
                                key={cat}
                                href={getCategoryPath(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/25"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                            >
                                {t(cat)}
                            </Link>
                        );
                    })}
                </div>

                {/* Grid Content */}
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="h-full">
                                    {/* Replace with your ProductCard component */}
                                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                                        <p className="font-bold">{local === 'en' ? product.nameEN : product.nameLA}</p>
                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}

                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Load More Products
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Filter className="h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or category.</p>
                    </div>
                )}
            </div>
        </section>
    );
}