"use client";

import { useLocale, useTranslations } from "next-intl";
import CloudinaryImage from "@/components/UI/CloudinaryImage";
import { Link } from "@/i18n/routing";
import { isEnglish } from "@/lib/utils/locale";
import { AlertCircle, Package, Pill } from "lucide-react"; // Optional: Icons for better UI
import { ProductCBF } from "@/lib/interface";
import { BooleanState, Category } from "@/generated/prisma/enums";
import { CATEGORY_SLUG_MAP } from "@/lib/constant";
import { translations } from "@/lib/translation";

export default function ProductCard({ product }: { product: ProductCBF }) {
  const t = useTranslations();
  const local = useLocale();

  // ✅ Function to format Category Enum to URL path
  // Example: ANTI_PARASITIC -> anti-parasitic
  const formatCategoryToPath = (cat: Category) => {
    return CATEGORY_SLUG_MAP[cat];
  };

  const title = isEnglish(local) ? product.nameEN : product.nameLA;
  const categoryPath = formatCategoryToPath(product.category);

  // ✅ URL Structure: /cbf/products/[category]/[slug]
  const detailHref = `/cbf/products/${categoryPath}/${product.slug}`;

  // Check if prescription is required (Assuming BooleanState is "TRUE" string or boolean)

  return (
    <Link href={detailHref} className="block h-full">
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer relative">
        {/* Image Section */}
        <div className="relative h-48 w-full bg-white border-b border-gray-50 overflow-hidden">
          {product.productImage ? (
            <CloudinaryImage
              src={product.productImage}
              alt={title || "Product Image"}
              fill
              loading="eager"
              className="object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
              No Image
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col grow">
          {/* SKU */}
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
            {product.isPrescription === BooleanState.TRUE && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded-md">
                <AlertCircle className="w-3 h-3" />
                {t(translations.prescriptionRequired)}
              </span>
            )}
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
