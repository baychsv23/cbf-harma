"use client";

import { isEnglish } from "@/lib/constant";
import { formatDate } from "@/lib/formateData";
import { Article } from "@/lib/interface";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

// สมมติว่า Enum ประกาศไว้แบบนี้
enum ArticleType {
  NEWS = "NEWS",
  HEALTH_KNOWLEDGE = "HEALTH_KNOWLEDGE",
  ACTIVITY = "ACTIVITY",
}

export default function ArticleCard({ article }: { article: Article }) {
  const t = useTranslations();
  const local = useLocale();

  // ✅ ฟังก์ชันแปลง Enum เป็น Path ตามเงื่อนไขที่คุณระบุ
  const formatTypeToPath = (type: string) => {
    switch (type) {
      case "NEWS":
        return "news";
      case "ACTIVITY":
        return "activitys"; // ตามที่คุณระบุ (เติม s)
      case "HEALTH_KNOWLEDGE":
        return "health-knowledges"; // ตามที่คุณระบุ (เติม s)
      default:
        return type.toLowerCase().replace(/_/g, "-");
    }
  };

  const title = isEnglish(local) ? article.titleEN : article.titleLA;
  const articleTypePath = formatTypeToPath(article.type);

  // ✅ โครงสร้าง URL: /public/[type]/[slug]
  const detailHref = `/public/${articleTypePath}/${article.slug}`;

  return (
    <Link href={detailHref} className="block h-full">
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
        {/* ส่วนรูปภาพ */}
        <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={title || "Article Image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
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
        </div>

        {/* ส่วนเนื้อหา */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{formatDate(article.createdAt)}</span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* สินค้าที่เกี่ยวข้อง */}
          {article.products && article.products.length > 0 && (
            <div className="mt-auto pt-4 flex flex-wrap gap-1">
              {article.products.slice(0, 2).map((p) => (
                <span
                  key={p.id}
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
