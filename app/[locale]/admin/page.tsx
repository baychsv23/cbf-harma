
import DashboardCharts from "@/components/Dashboard/DashboardCharts";
import DashboardFilter from "@/components/Dashboard/DashboardFilter";
import { ArticleStatus } from "@/generated/prisma/enums";
import { database } from "@/lib/prisma"; // หรือ path ที่คุณใช้งาน
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";

// Helper Functions
const getMonthName = (monthNum: number) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return date.toLocaleString('default', { month: 'short' });
};

// ฟังก์ชันหาจำนวนวันในเดือนนั้นๆ (เช่น กุมภา มี 28 หรือ 29 วัน)
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ year?: string; month?: string }>;
}) {
    const params = await searchParams;

    const now = new Date();
    const selectedYear = Number(params.year) || now.getFullYear();
    const selectedMonth = params.month ? Number(params.month) : undefined;

    // 1. Where Condition
    const whereCondition: any = {
        year: selectedYear,
    };
    if (selectedMonth) {
        whereCondition.month = selectedMonth;
    }

    // --- Query 1: Stats Cards (เหมือนเดิม) ---
    const statusStats = await database.article.groupBy({
        by: ['status'],
        where: whereCondition,
        _count: { _all: true },
    });

    const publishedCount = statusStats.find(s => s.status === ArticleStatus.PUBLISHED)?._count._all || 0;
    const draftCount = statusStats.find(s => s.status === ArticleStatus.DRAFT)?._count._all || 0;
    const totalArticles = publishedCount + draftCount;

    // --- Query 2: Dynamic Chart Data (เปลี่ยน Logic ตรงนี้) ---
    let mainChartData = [];
    let mainChartTitle = "";

    if (selectedMonth) {
        // === CASE A: เลือกเดือน -> แสดงรายวัน (1-31) ===
        mainChartTitle = `Daily Views in ${getMonthName(selectedMonth)} ${selectedYear}`;

        // เนื่องจากใน DB ไม่มี column 'day' เราต้องดึง publishedAt มาจัดกลุ่มเอง
        const articlesInMonth = await database.article.findMany({
            where: {
                year: selectedYear,
                month: selectedMonth,
                status: ArticleStatus.PUBLISHED, // นับเฉพาะที่ publish แล้ว
                publishedAt: { not: null }      // กันเหนียว
            },
            select: {
                publishedAt: true,
                views: true,
            },
        });

        // สร้าง Array ว่างๆ ตามจำนวนวันในเดือนนั้น (เช่น 30 หรือ 31 ช่อง)
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        const dailyMap = new Map<number, number>();

        // วน Loop รวมยอดวิวตามวันที่
        articlesInMonth.forEach((article) => {
            if (article.publishedAt) {
                const day = article.publishedAt.getDate(); // ได้วันที่ 1-31
                const currentViews = dailyMap.get(day) || 0;
                dailyMap.set(day, currentViews + article.views);
            }
        });

        // แปลง Map เป็น Format สำหรับ Recharts
        mainChartData = Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            return {
                name: dayNum.toString(), // แกน X เป็นวันที่ 1, 2, 3...
                value: dailyMap.get(dayNum) || 0,
            };
        });

    } else {
        // === CASE B: ดูทั้งปี -> แสดงรายเดือน (Jan-Dec) แบบเดิม ===
        mainChartTitle = `Monthly Views in ${selectedYear}`;

        const viewsByMonthRaw = await database.article.groupBy({
            by: ['month'],
            where: { year: selectedYear },
            _sum: { views: true },
            orderBy: { month: 'asc' },
        });

        mainChartData = Array.from({ length: 12 }, (_, i) => {
            const monthNum = i + 1;
            const found = viewsByMonthRaw.find((v) => v.month === monthNum);
            return {
                name: getMonthName(monthNum), // แกน X เป็น Jan, Feb...
                value: found?._sum.views || 0,
            };
        });
    }

    // --- Query 3: Yearly Comparison (เหมือนเดิม) ---
    const viewsByYearRaw = await database.article.groupBy({
        by: ['year'],
        where: whereCondition,
        _sum: { views: true },
        orderBy: { year: 'asc' },
    });

    const yearlyChartData = viewsByYearRaw.map((v) => ({
        name: v.year.toString(),
        value: v._sum.views || 0,
    }));

    // --- Query 4: Lifetime Views (เหมือนเดิม) ---
    const totalLifetimeViews = await database.article.aggregate({
        where: whereCondition,
        _sum: { views: true }
    });

    return (
        <main className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Analytics for <span className="font-bold text-primary">
                            {selectedMonth ? getMonthName(selectedMonth) : "All Year"} {selectedYear}
                        </span>
                    </p>
                </div>

                <DashboardFilter />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* ... (Code ส่วน Card เหมือนเดิมเป๊ะ ไม่ต้องแก้) ... */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Published</p>
                            <h2 className="text-3xl font-bold text-gray-900">{publishedCount}</h2>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Drafts</p>
                            <h2 className="text-3xl font-bold text-gray-900">{draftCount}</h2>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total New Articles</p>
                            <h2 className="text-3xl font-bold text-gray-900">{totalArticles}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-6 h-6" /></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Lifetime Views</p>
                            <h2 className="text-3xl font-bold text-gray-900">{(totalLifetimeViews._sum.views || 0).toLocaleString()}</h2>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                    </div>
                </div>

                {/* ส่งข้อมูลเข้ากราฟ พร้อม Title ที่เปลี่ยนไปตามเงื่อนไข */}
                <DashboardCharts
                    mainChartData={mainChartData}
                    mainChartTitle={mainChartTitle}
                    yearlyViews={yearlyChartData}
                />

            </div>
        </main>
    );
}