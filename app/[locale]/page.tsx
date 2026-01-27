import BannerSection from "@/components/UI/BannerSection";
import Link from "next/link";
import ArticleCard from "@/components/UI/Card/ArticleCard";
import { Article } from "@/lib/interface";
import apiServer from "@/lib/api-server";

// ฟังก์ชันดึงข้อมูลด้วย Axios
async function getLatestArticles() {
  try {
    const response = await apiServer.get("/api/articles", {
      params: { limit: 10 },
      // ป้องกันการจำ Cache ถ้าต้องการข้อมูลสดใหม่เสมอ
      headers: { "Cache-Control": "no-store" },
    });
    return response.data.data;
  } catch (error) {
    // คืนค่า array ว่าง เพื่อไม่ให้หน้าเว็บล่ม (Graceful Degradation)
    return [];
  }
}

export default async function Home() {
  // เรียกใช้ฟังก์ชัน (ทำงานฝั่ง Server)
  const articles = await getLatestArticles();
  return (
    <main className="min-h-screen bg-gray-50/30 pb-20">
      {/* 1. Banner Section */}
      <div className="pt-6">
        <BannerSection />
      </div>

      {/* 2. Latest Updates Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Latest Updates</h2>
            <p className="text-gray-500 mt-1">
              ติดตามข่าวสารและกิจกรรมล่าสุดของเรา
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            View All Updates →
          </Link>
        </div>

        {/* Content Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(articles as Article[]).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">ยังไม่มีข้อมูลข่าวสารในขณะนี้</p>
          </div>
        )}

        {/* Mobile Button */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/articles"
            className="inline-block w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary shadow-lg"
          >
            View All Updates
          </Link>
        </div>
      </div>
    </main>
  );
}
