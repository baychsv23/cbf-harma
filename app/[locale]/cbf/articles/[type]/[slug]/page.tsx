import { formatDate } from "@/lib/formateData";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  Tag,
  Clock,
  ShoppingBag,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
// import ArticleViewCounter from "@/components/ArticleViewCounter"; // Uncomment when ready
import { ArticleStatus, Category } from "@/generated/prisma/enums";
import { getArticleBySlug } from "@/lib/getDataSlug";
import { isEnglish } from "@/lib/utils/locale";
import { ArticleCBF } from "@/lib/interface";
import { selectDataOfArticle } from "@/lib/selectData";
import { CATEGORY_SLUG_MAP } from "@/lib/constant";

// 1. Generate Metadata (คงเดิม)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, {
    where: { status: ArticleStatus.PUBLISHED },
  });

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.titleEN,
    description: article.contentEN?.substring(0, 160),
    openGraph: {
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticleSingleCBFPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations()
  const article = (await getArticleBySlug(slug, {
    where: { status: ArticleStatus.PUBLISHED },
    select: selectDataOfArticle,
  })) as ArticleCBF;

  if (!article) {
    notFound();
  }

  const isEn = isEnglish(locale);
  const title = isEn ? article.titleEN : article.titleLA;
  const content = isEn ? article.contentEN : article.contentLA;
  const products = article.products || [];

  // Helper to generate product link
  const getProductLink = (p: { category: Category; slug: string }) => {
    const catSlug = CATEGORY_SLUG_MAP[p.category] || "products";
    return `/cbf/products/${catSlug}/${p.slug}`;
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      {/* <ArticleViewCounter slug={slug} /> */}

      {/* --- 1. Top Navigation Bar (Sticky & Glassmorphism) --- */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <Link
            href="/cbf/articles"
            className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Back to Articles</span>
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 max-w-6xl mt-6 md:mt-10">

        {/* --- 2. Hero Section --- */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 items-start">

          {/* Left: Content Header */}
          <div className="flex-1 order-2 lg:order-1 flex flex-col justify-center">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-5 w-fit border border-blue-100">
              <Tag className="w-3 h-3" />
              {t(article.type)}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.2] tracking-tight">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{formatDate(article.publishedAt)}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span>{article.views.toLocaleString()} Reads</span>
              </div>
            </div>
          </div>

          {/* Right: Cover Image */}
          <div className="w-full lg:w-[45%] order-1 lg:order-2">
            <div className="relative aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg bg-gray-100 ring-1 ring-black/5">
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Tag className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-sm">No Cover Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- 3. Main Layout: Content + Sidebar --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">

          {/* LEFT: Article Body */}
          <div className="min-w-0">
            {/* Prose Configuration for Beautiful Typography */}
            <div className="
              prose prose-lg md:prose-xl prose-stone max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-p:leading-relaxed prose-p:text-gray-600
              prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-li:marker:text-primary
            ">
              <div dangerouslySetInnerHTML={{ __html: content || "" }} />
            </div>
          </div>

          {/* RIGHT: Sidebar (Sticky) */}
          <aside className="space-y-8 h-fit lg:sticky lg:top-24">
            {products.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm ring-4 ring-gray-50/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Related Products
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={getProductLink(p)}
                      className="group flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-100 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* Product Thumb */}
                      <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/20">
                        {p.productImage ? (
                          <Image
                            src={p.productImage}
                            alt={isEn ? p.nameEN : p.nameLA}
                            fill
                            className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-primary uppercase mb-0.5 tracking-wider">
                          {p.category.replace(/_/g, " ")}
                        </p>
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {isEn ? p.nameEN : p.nameLA}
                        </h4>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors -ml-2" />
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <Link href="/cbf/products" className="text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-wide transition-colors">
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </main>
  );
}