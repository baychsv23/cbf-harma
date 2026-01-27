import axios from "axios";
import BannerSection from "@/components/UI/BannerSection";
import Link from "next/link";
import { useApiWithAlert } from "../hooks/useApiWithAlert";
import ArticleCard from "@/components/UI/Card/ArticleCard";
import { useLocale } from "next-intl";
import { Article } from "@/lib/interface";

// ฟังก์ชันดึงข้อมูลด้วย Axios
async function getLatestArticles() {
  // ⚠️ สำคัญ: บน Server Side ต้องใช้ Full URL เท่านั้น

  try {
    const response = await axios.get(`http://localhost:3000/api/articles`, {
      params: {
        limit: 10,
        status: 'PUBLISHED'
      },
      // ถ้าต้องการให้ข้อมูลสดใหม่เสมอ (ไม่ cache) ให้ใส่ headers เพิ่ม
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      }
    });

    return response.data.data; // axios จะหุ้มด้วย data อีกชั้น แล้ว API เราก็คืนค่า key ชื่อ data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return []; // คืนค่า array ว่างเพื่อไม่ให้เว็บพัง
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
            <p className="text-gray-500 mt-1">ติดตามข่าวสารและกิจกรรมล่าสุดของเรา</p>
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
          <Link href="/articles" className="inline-block w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary shadow-lg">
            View All Updates
          </Link>
        </div>

      </div>
    </main>
  );
}