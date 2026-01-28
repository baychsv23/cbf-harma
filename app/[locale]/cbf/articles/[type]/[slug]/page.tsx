import { getArticleBySlug } from "@/lib/getData";
import { isEnglish } from "@/lib/constant";
import { formatDate } from "@/lib/formateData";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import ArticleViewCounter from "@/components/ArticleViewCounter";

// 1. Generate Metadata for SEO (Facebook/Google Show this)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) return { title: "Article Not Found" };

    return {
        title: article.titleEN, // หรือใช้ logic เช็คภาษา
        description: article.contentEN?.substring(0, 160), // ตัดคำสั้นๆ มาทำ description
        openGraph: {
            images: article.coverImage ? [article.coverImage] : [],
        },
    };
}

export default async function ArticleSinglePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // 1. Await params (Next.js 15 requirement)
    const { slug } = await params;
    const locale = await getLocale()

    // 2. Fetch Data directly from DB
    const article = await getArticleBySlug(slug);

    // 3. Handle 404
    if (!article) {
        notFound();
    }
    const title = isEnglish(locale) ? article.titleEN : article.titleLA;
    const content = isEnglish(locale) ? article.contentEN : article.contentLA;
    const products = article.products || [];

    return (
        <main className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <ArticleViewCounter slug={slug} />
                {/* Back Button */}
                <Link
                    href="/public/articles"
                    className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Articles
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Cover Image */}
                    <div className="relative w-full h-[300px] md:h-[500px] bg-gray-200">
                        {article.coverImage ? (
                            <Image
                                src={article.coverImage}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No Cover Image
                            </div>
                        )}

                        {/* Category Badge */}
                        <span className="absolute bottom-4 left-4 md:bottom-6 md:left-8 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            {article.type}
                        </span>
                    </div>

                    {/* Article Body */}
                    <div className="p-6 md:p-10 lg:p-14">

                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{formatDate(article.createdAt)}</span>
                            </div>

                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                            {title}
                        </h1>

                        {/* Content (Rich Text) */}
                        {/* ใช้ prose จาก @tailwindcss/typography เพื่อจัด format HTML ให้อัตโนมัติ */}
                        <article className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                            {/* ⚠️ ระวัง: การใช้ dangerouslySetInnerHTML ต้องมั่นใจว่า content ปลอดภัย (Sanitized) */}
                            <div dangerouslySetInnerHTML={{ __html: content || "" }} />
                        </article>

                        {/* Divider */}
                        <hr className="my-10 border-gray-100" />

                        {/* Related Products Section (ถ้ามีสินค้าเกี่ยวข้อง) */}
                        {products.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" />
                                    Related Products
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {products.map((p) => (
                                        <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            {/* Placeholder รูปสินค้า */}
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                                                {p.productImage ? (
                                                    <Image
                                                        src={p.productImage}
                                                        alt={title}
                                                        fill
                                                        className="object-cover"
                                                        priority
                                                    />
                                                ) : null}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm line-clamp-2">
                                                    {isEnglish(locale) ? p.nameEN : p.nameLA}
                                                </p>
                                                <span className="text-xs text-primary font-medium">View Product</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </main>
    );
}