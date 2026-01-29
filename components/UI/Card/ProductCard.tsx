"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { isEnglish } from "@/lib/utils/locale";
import { AlertCircle, Package, Pill } from "lucide-react"; // Optional: Icons for better UI
import { ProductCBF } from "@/lib/interface";

export default function ProductCard({ product }: { product: ProductCBF }) {
    const t = useTranslations();
    const local = useLocale();

    // ✅ Function to format Category Enum to URL path
    // Example: ANTI_PARASITIC -> anti-parasitic
    const formatCategoryToPath = (category: string) => {
        return category.toLowerCase().replace(/_/g, "-");
    };

    const title = isEnglish(local) ? product.nameEN : product.nameLA;
    const categoryPath = formatCategoryToPath(product.category);

    // ✅ URL Structure: /cbf/products/[category]/[slug]
    const detailHref = `/cbf/products/${categoryPath}/${product.slug}`;

    // Check if prescription is required (Assuming BooleanState is "TRUE" string or boolean)
    const isRx = String(product.isPrescription) === "TRUE";

    return (
        <Link href={detailHref} className="block h-full">
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer relative">

                {/* Image Section */}
                <div className="relative h-52 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                    {product.productImage ? (
                        <Image
                            src={product.productImage}
                            alt={title || "Product Image"}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gray-50">
                            <Package className="w-10 h-10 mb-2" />
                            <span className="text-xs">No Image</span>
                        </div>
                    )}

                    {/* Category Badge (Top Left) */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm z-10 border border-gray-100 uppercase tracking-wide">
                        {t(product.category)}
                    </span>

                    {/* Prescription Badge (Top Right) - Only if RX */}
                    {isRx && (
                        <span className="absolute top-3 right-3 bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm z-10 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            RX Only
                        </span>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* SKU */}
                    <div className="text-[10px] text-gray-400 font-mono mb-1 uppercase tracking-wider">
                        SKU: {product.sku}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {/* Generic Name (Important for Meds) */}
                    {product.genericName && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1 italic">
                            {product.genericName}
                        </p>
                    )}

                    {/* Footer: Dosage & Packaging */}
                    <div className="mt-auto pt-3 border-t border-gray-50 flex flex-wrap gap-2">
                        {product.dosage && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                <Pill className="w-3 h-3" />
                                {product.dosage}
                            </span>
                        )}
                        {product.packaging && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                <Package className="w-3 h-3" />
                                {product.packaging}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}