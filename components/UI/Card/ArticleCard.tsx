"use client";

import { formatDate } from "@/lib/formateData";
import { ArticleCBF } from "@/lib/interface";
import { useLocale, useTranslations } from "next-intl";
import CloudinaryImage from "@/components/UI/CloudinaryImage";
import { Link } from "@/i18n/routing";
import { ArticleType } from "@/generated/prisma/enums";
import { isEnglish } from "@/lib/utils/locale";
import { TYPE_SLUG_MAP } from "@/lib/constant";

export default function ArticleCard({ article }: { article: ArticleCBF }) {
  const t = useTranslations();
  const local = useLocale();

  // ✅ ฟังก์ชันแปลง Enum เป็น Path ตามเงื่อนไขที่คุณระบุ
  const formatTypeToPath = (type: ArticleType) => {
    return TYPE_SLUG_MAP[type];
  };

  const title = isEnglish(local) ? article.titleEN : article.titleLA;
  const articleTypePath = formatTypeToPath(article.type);

  // ✅ โครงสร้าง URL: /public/[type]/[slug]
  const detailHref = `/cbf/articles/${articleTypePath}/${article.slug}`;

  return (
    <Link href={detailHref} className="block h-full">
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
        {/* ส่วนรูปภาพ */}
        <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
          {article.coverImage ? (
            <CloudinaryImage
              src={article.coverImage}
              alt={title || "Article Image"}
              fill
              loading="eager"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
              No Image
            </div>
          )}

          {/* Badge ประเภทบทความ */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm z-10">
            {t(article.type)}
          </span>
          <span className="absolute top-3 right-0 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm z-10">
            {article.views} views
          </span>
        </div>

        {/* ส่วนเนื้อหา */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title.length > 50 ? title.slice(0, 50) + "..." : title}
          </h3>

          {/* สินค้าที่เกี่ยวข้อง */}
          {article.products && article.products.length > 0 && (
            <div className="mt-auto pt-4 flex flex-wrap gap-1">
              {article.products.slice(0, 2).map((p, index) => (
                <span
                  key={index}
                  className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100"
                >
                  {isEnglish(local) ? p.nameEN : p.nameLA}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
