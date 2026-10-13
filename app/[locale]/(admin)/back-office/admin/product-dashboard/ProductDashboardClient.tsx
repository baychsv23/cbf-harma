"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryChartItem = { name: string; views: number; count: number };
type ActiveStatusItem = { name: string; active: number; inactive: number };
type TopProductItem = {
  name: string;
  nameLa: string;
  views: number;
  category: string;
  isActive: boolean;
  isPrescription: boolean;
};

interface Props {
  categoryChartData: CategoryChartItem[];
  activeStatusChartData: ActiveStatusItem[];
  topProductsData: TopProductItem[];
  selectedCategory: string;
  selectedIsActive: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "NUTRITION_ELECTROLYTE", label: "Nutrition & Electrolyte" },
  { value: "ANTIBIOTICS", label: "Antibiotics" },
  { value: "ANTI_PARASITIC", label: "Anti-Parasitic" },
  { value: "GASTROINTESTINAL", label: "Gastrointestinal" },
  { value: "CARDIOVASCULAR", label: "Cardiovascular" },
  { value: "ANTI_DIABETIC", label: "Anti-Diabetic" },
  { value: "RESPIRATORY", label: "Respiratory" },
  { value: "ANTI_ALLERGIC", label: "Anti-Allergic" },
  { value: "EFFECTIVE_TO_PSYCHOTIC", label: "Psychotics" },
  { value: "ANESTHETICS", label: "Anesthetics" },
  { value: "ANALGESIC_ANTIPYRETIC", label: "Analgesic / Antipyretic" },
  { value: "VITAMINS_MINERALS", label: "Vitamins & Minerals" },
  { value: "DISINFECTANTS_ANTISEPTIC", label: "Disinfectants & Antiseptic" },
  { value: "OTHERS", label: "Others" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDashboardClient({
  categoryChartData,
  activeStatusChartData,
  topProductsData,
  selectedCategory,
  selectedIsActive,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <>
      {/* ── Filter ── */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">{t(translations.category)}:</label>
          <select
            value={selectedCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value ? t(c.value) : t(translations.allCategories)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">{t(translations.status)}:</label>
          <select
            value={selectedIsActive}
            onChange={(e) => updateFilter("isActive", e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">{t(translations.allStatus)}</option>
            <option value="TRUE">{t(translations.active)}</option>
            <option value="FALSE">{t(translations.inactive)}</option>
          </select>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Views by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            {t(translations.viewsByCategory)}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryChartData}
              margin={{ top: 5, right: 20, bottom: 60, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number | undefined) => [
                  v?.toLocaleString() || "0",
                  t(translations.views),
                ]}
              />
              <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Active vs Inactive — full width */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            {t(translations.activeVsInactiveByCategory)}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={activeStatusChartData}
              margin={{ top: 5, right: 20, bottom: 60, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="active" name={t(translations.active)} stackId="a" fill="#22c55e" />
              <Bar
                dataKey="inactive"
                name={t(translations.inactive)}
                stackId="a"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table: Top 10 Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            {t(translations.top30ProductsByViews)}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 pr-4 font-medium">{t(translations.stt)}</th>
                  <th className="pb-3 pr-4 font-medium">{t(translations.productEN)}</th>
                  <th className="pb-3 pr-4 font-medium">{t(translations.productLA)}</th>
                  <th className="pb-3 pr-4 font-medium">{t(translations.category)}</th>
                  <th className="pb-3 pr-4 font-medium">{t(translations.status)}</th>
                  <th className="pb-3 pr-4 font-medium">{t(translations.rx)}</th>
                  <th className="pb-3 font-medium text-right">{t(translations.views)}</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-3 pr-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{p.nameLa}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {p.isActive ? t(translations.active) : t(translations.inactive)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.isPrescription
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isPrescription ? t(translations.rx) : t(translations.otc)}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      {p.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
