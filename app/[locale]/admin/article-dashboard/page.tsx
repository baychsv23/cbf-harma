import DashboardCharts from "@/components/Dashboard/DashboardCharts";
import DashboardFilter from "@/components/Dashboard/DashboardFilter";
import { BooleanState } from "@/generated/prisma/enums";
import { database } from "@/lib/prisma";
import { Package, CheckCircle, XCircle, TrendingUp } from "lucide-react";

// Helper Functions
const getMonthName = (monthNum: number) => {
  const date = new Date();
  date.setMonth(monthNum - 1);
  return date.toLocaleString("default", { month: "short" });
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export default async function ProductDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;

  const now = new Date();
  const selectedYear = Number(params.year) || now.getFullYear();
  const selectedMonth = params.month ? Number(params.month) : undefined;

  // --- Date Range ---
  const startDate = selectedMonth
    ? new Date(selectedYear, selectedMonth - 1, 1)
    : new Date(selectedYear, 0, 1);

  const endDate = selectedMonth
    ? new Date(selectedYear, selectedMonth, 0, 23, 59, 59)
    : new Date(selectedYear, 11, 31, 23, 59, 59);

  const whereCondition = {
    createdAt: { gte: startDate, lte: endDate },
  };

  // --- Query 1: Stats Cards ---
  const statusStats = await database.product.groupBy({
    by: ["isActive"],
    where: whereCondition,
    _count: { _all: true },
  });

  const activeCount =
    statusStats.find((s) => s.isActive === BooleanState.TRUE)?._count._all || 0;
  const inactiveCount =
    statusStats.find((s) => s.isActive === BooleanState.FALSE)?._count._all ||
    0;
  const totalProducts = activeCount + inactiveCount;

  // --- Query 2: Lifetime Views ---
  const totalLifetimeViews = await database.product.aggregate({
    where: whereCondition,
    _sum: { views: true },
  });

  // --- Query 3: Dynamic Chart Data ---
  let mainChartData: { name: string; value: number }[] = [];
  let mainChartTitle = "";

  if (selectedMonth) {
    // CASE A: เลือกเดือน -> แสดงรายวัน
    mainChartTitle = `Daily Views in ${getMonthName(selectedMonth)} ${selectedYear}`;

    const productsInMonth = await database.product.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        isActive: BooleanState.TRUE,
      },
      select: {
        createdAt: true,
        views: true,
      },
    });

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const dailyMap = new Map<number, number>();

    productsInMonth.forEach((product) => {
      const day = product.createdAt.getDate();
      dailyMap.set(day, (dailyMap.get(day) || 0) + product.views);
    });

    mainChartData = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      return {
        name: dayNum.toString(),
        value: dailyMap.get(dayNum) || 0,
      };
    });
  } else {
    // CASE B: ดูทั้งปี -> แสดงรายเดือน
    mainChartTitle = `Monthly Views in ${selectedYear}`;

    const productsInYear = await database.product.findMany({
      where: whereCondition,
      select: {
        createdAt: true,
        views: true,
      },
    });

    const monthlyMap = new Map<number, number>();
    productsInYear.forEach((product) => {
      const month = product.createdAt.getMonth() + 1;
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + product.views);
    });

    mainChartData = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      return {
        name: getMonthName(monthNum),
        value: monthlyMap.get(monthNum) || 0,
      };
    });
  }

  // --- Query 4: Yearly Comparison ---
  const productsAllYears = await database.product.findMany({
    select: {
      createdAt: true,
      views: true,
    },
  });

  const yearlyMap = new Map<number, number>();
  productsAllYears.forEach((product) => {
    const year = product.createdAt.getFullYear();
    yearlyMap.set(year, (yearlyMap.get(year) || 0) + product.views);
  });

  const yearlyChartData = Array.from(yearlyMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, views]) => ({
      name: year.toString(),
      value: views,
    }));

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Product Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Analytics for{" "}
            <span className="font-bold text-primary">
              {selectedMonth ? getMonthName(selectedMonth) : "All Year"}{" "}
              {selectedYear}
            </span>
          </p>
        </div>

        <DashboardFilter />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {activeCount}
              </h2>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Inactive</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {inactiveCount}
              </h2>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Products
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {totalProducts}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Lifetime Views
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {(totalLifetimeViews._sum.views || 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <DashboardCharts
          mainChartData={mainChartData}
          mainChartTitle={mainChartTitle}
          yearlyViews={yearlyChartData}
        />
      </div>
    </main>
  );
}
