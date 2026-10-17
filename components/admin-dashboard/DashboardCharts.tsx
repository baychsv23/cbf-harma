"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type ChartData = {
    name: string | number;
    value: number;
};

interface DashboardChartsProps {
    mainChartData: ChartData[];  // เปลี่ยนชื่อเพื่อให้สื่อความหมายว่าข้อมูลนี้เปลี่ยนไปมาได้
    mainChartTitle: string;      // รับชื่อหัวข้อกราฟมาแสดง
    yearlyViews: ChartData[];
}

export default function DashboardCharts({
    mainChartData,
    mainChartTitle,
    yearlyViews,
}: DashboardChartsProps) {

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
                    <p className="font-bold text-gray-700 mb-1">{label}</p>
                    <p className="text-primary font-medium">
                        Views: {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 pb-10">

            {/* Chart 1: Dynamic Chart (Monthly or Daily) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    {mainChartTitle}
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mainChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                // ถ้าข้อมูลเยอะ (เช่น 31 วัน) ให้แสดงทุกๆ 2-3 step เพื่อไม่ให้รก
                                interval={mainChartData.length > 20 ? 1 : 0}
                            />
                            <YAxis
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {mainChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Views by Year (Static) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Yearly Trend
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyViews}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {yearlyViews.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#10b981" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}