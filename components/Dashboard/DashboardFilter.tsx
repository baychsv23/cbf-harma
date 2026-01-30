"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function DashboardFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ดึงค่าจาก URL ถ้าไม่มีให้ใช้ค่าปัจจุบัน
    const currentYear = new Date().getFullYear();
    const selectedYear = searchParams.get("year") || currentYear.toString();
    const selectedMonth = searchParams.get("month") || ""; // ถ้าว่าง คือ "ทั้งปี"

    // สร้าง list ปี (ย้อนหลัง 5 ปี)
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const months = [
        { value: "", label: "All Months" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

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
            <span className="text-sm font-bold text-gray-700">Filter:</span>

            {/* เลือกปี */}
            <select
                value={selectedYear}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
                {years.map((y) => (
                    <option key={y} value={y}>
                        Year {y}
                    </option>
                ))}
            </select>

            {/* เลือกเดือน */}
            <select
                value={selectedMonth}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
                {months.map((m) => (
                    <option key={m.value} value={m.value}>
                        {m.label}
                    </option>
                ))}
            </select>
        </div>
    );
}