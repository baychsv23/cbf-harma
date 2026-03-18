import { BooleanState, Category } from "@/generated/prisma/enums";
import { database } from "@/lib/prisma";
import { Package, CheckCircle, TrendingUp, ShieldAlert } from "lucide-react";
import ProductDashboardClient from "./ProductDashboardClient";
import { getTranslations } from "next-intl/server";
import { translations } from "@/lib/translation";

export default async function ProductDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; isActive?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category as Category | undefined;
  const selectedIsActive = params.isActive;
  const t = await getTranslations();
  const whereCondition: any = {};
  if (selectedCategory) whereCondition.category = selectedCategory;
  if (selectedIsActive)
    whereCondition.isActive = selectedIsActive as BooleanState;

  const [totalProducts, activeCount, prescriptionCount, totalViewsAgg] =
    await Promise.all([
      database.product.count({ where: whereCondition }),
      database.product.count({
        where: { ...whereCondition, isActive: BooleanState.TRUE },
      }),
      database.product.count({
        where: { ...whereCondition, isPrescription: BooleanState.TRUE },
      }),
      database.product.aggregate({
        where: whereCondition,
        _sum: { views: true },
      }),
    ]);

  const totalViews = totalViewsAgg._sum.views || 0;
  const inactiveCount = totalProducts - activeCount;

  const viewsByCategoryRaw = await database.product.groupBy({
    by: ["category"],
    where: whereCondition,
    _sum: { views: true },
    _count: { _all: true },
    orderBy: { _sum: { views: "desc" } },
  });

  const categoryChartData = viewsByCategoryRaw.map((v) => ({
    name: t(v.category),
    views: v._sum.views || 0,
    count: v._count._all,
  }));

  const activeStatusRaw = await database.product.groupBy({
    by: ["category", "isActive"],
    where: whereCondition,
    _count: { _all: true },
    orderBy: { category: "asc" },
  });

  const activeByCategory = new Map<
    string,
    { active: number; inactive: number }
  >();
  for (const row of activeStatusRaw) {
    const label = t(row.category);
    if (!activeByCategory.has(label))
      activeByCategory.set(label, { active: 0, inactive: 0 });
    const entry = activeByCategory.get(label)!;
    if (row.isActive === BooleanState.TRUE) entry.active += row._count._all;
    else entry.inactive += row._count._all;
  }
  const activeStatusChartData = Array.from(activeByCategory.entries()).map(
    ([name, val]) => ({
      name,
      ...val,
    }),
  );

  const allProducts = await database.product.findMany({
    where: whereCondition,
    take: 30,
    orderBy: { views: "desc" },
    select: {
      nameEN: true,
      nameLA: true,
      views: true,
      category: true,
      isActive: true,
      isPrescription: true,
    },
  });

  const allProductsData = allProducts.map((p) => ({
    name: p.nameEN,
    nameLa: p.nameLA,
    views: p.views,
    category: t(p.category),
    isActive: p.isActive === BooleanState.TRUE,
    isPrescription: p.isPrescription === BooleanState.TRUE,
  }));

  const stats = {
    totalProducts,
    activeCount,
    inactiveCount,
    prescriptionCount,
    totalViews,
    prescriptionPct:
      totalProducts > 0
        ? Math.round((prescriptionCount / totalProducts) * 100)
        : 0,
  };

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t(translations.productDashboard)}
          </h1>
          <p className="text-gray-500 mt-1">
            {t(translations.analyticsFor)}{" "}
            <span className="font-bold text-primary">
              {selectedCategory ? t(selectedCategory) : t(translations.allCategories)}
            </span>
            {selectedIsActive && (
              <>
                {" · "}
                <span className="font-bold text-primary">
                  {selectedIsActive === "TRUE"
                    ? t(translations.activeOnly)
                    : t(translations.inactiveOnly)}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Stats Cards (Server-rendered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t(translations.totalProducts)}
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
                {t(translations.activeProducts)}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {activeCount}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {inactiveCount} {t(translations.inactive).toLowerCase()}
              </p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t(translations.prescriptionRequired)}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {prescriptionCount}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {stats.prescriptionPct}{t(translations.pctOfTotal)}
              </p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t(translations.views)}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {totalViews.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Client component handles Filter + Charts */}
        <ProductDashboardClient
          categoryChartData={categoryChartData}
          activeStatusChartData={activeStatusChartData}
          topProductsData={allProductsData}
          selectedCategory={selectedCategory || ""}
          selectedIsActive={selectedIsActive || ""}
        />
      </div>
    </main>
  );
}
