"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";

export default function DashboardFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();

    // ดึงค่าจาก URL ถ้าไม่มีให้ใช้ค่าปัจจุบัน
    const currentYear = new Date().getFullYear();
    const selectedYear = searchParams.get("year") || currentYear.toString();
    const selectedMonth = searchParams.get("month") || ""; // ถ้าว่าง คือ "ทั้งปี"

    // ฟังก์ชันเปลี่ยน URL
    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`?${params.toString()}`);
        },
        [searchParams, router]
    );

    return (
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 items-center">
            <span className="text-sm font-bold text-gray-700">{t(translations.Filter, { name: t(translations.article) })}:</span>

            {/* เลือกปี */}
            <div className="w-full md:w-32">

                <input
                    type="number"
                    placeholder="YYYY"
                    min="2025"
                    max={new Date().getFullYear() + 1}
                    value={selectedYear}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            {/* เลือกเดือน */}
            <select
                value={selectedMonth}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
                <option value="">{t(translations.All, { name: t(translations.month) })}</option>
                {[
                    translations.january, translations.february, translations.march,
                    translations.april, translations.may, translations.june,
                    translations.july, translations.august, translations.september,
                    translations.october, translations.november, translations.december
                ].map((monthKey, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                        {t(monthKey)}
                    </option>
                ))}
            </select>
        </div>
    );
}