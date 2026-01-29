import { formatDate } from "@/lib/formateData";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  Tag,
  Share2,
  Clock,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
// import ArticleViewCounter from "@/components/ArticleViewCounter"; // Uncomment when ready
import { ArticleStatus, Category } from "@/generated/prisma/enums";
import { getArticleBySlug } from "@/lib/getDataSlug";
import { isEnglish } from "@/lib/utils/locale";
import { ArticleCBF } from "@/lib/interface";
import { selectDataOfArticle } from "@/lib/selectData";
import { CATEGORY_SLUG_MAP } from "@/lib/constant"; // Assuming you have this from previous steps

// 1. Generate Metadata
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

      {/* --- 1. Top Navigation Bar --- */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/cbf/articles"
            className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-2 group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Articles
          </Link>

          <div className="flex items-center gap-3">
            {/* Share Button Placeholder */}
            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 max-w-6xl mt-8 md:mt-12">
        {/* --- 2. Article Header --- */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12 items-start mb-10 border-b border-gray-100 pb-10">
          {/* LEFT: Title & Metadata */}
          <div className="flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-4 w-fit">
              <Tag className="w-3 h-3" />
              {article.type.replace(/_/g, " ")}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{article.views} Views</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Image (Half Size) */}
          {/* I changed aspect ratio to video (16:9) so it's not too tall */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm bg-gray-100 order-first md:order-last">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Cover Image
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          {/* LEFT: Main Content */}
          <div className="min-w-0">
            <div className="prose prose-lg prose-stone hover:prose-a:text-primary max-w-none leading-loose">
              <div dangerouslySetInnerHTML={{ __html: content || "" }} />
            </div>
          </div>

          {/* RIGHT: Sidebar (Stays the same) */}
          <aside className="space-y-8">
            <aside className="space-y-8">
              {/* Widget: Related Products */}
              {products.length > 0 && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-gray-900">
                      Related Products
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {products.map((p) => (
                      <Link
                        key={p.slug}
                        href={getProductLink(p)}
                        className="group flex gap-4 items-start bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                      >
                        {/* Product Thumb */}
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          {p.productImage ? (
                            <Image
                              src={p.productImage}
                              alt={isEn ? p.nameEN : p.nameLA}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary uppercase mb-0.5 tracking-wide">
                            {p.category.replace(/_/g, " ")}
                          </p>
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {isEn ? p.nameEN : p.nameLA}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 font-medium">
                            View details <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Widget: Newsletter or Share (Visual Only) */}
            </aside>
          </aside>
        </div>
      </article>

      {/* --- 5. Mobile Only: Related Products (If you want them at bottom on mobile) --- */}
      {/* The Grid layout above handles stacking automatically, but if you want a specific visual break: */}
      <div className="lg:hidden container mx-auto px-4 mt-12 pt-8 border-t border-gray-100">
        {/* You can duplicate the Related Products here if you feel the sidebar gets pushed too far down on mobile, 
             or just rely on the flex stacking order. Currently, it stacks nicely below content. */}
      </div>
    </main>
  );
}
