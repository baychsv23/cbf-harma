"use client";
import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Package,
    AlertCircle,
    Truck,
    CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/getCurrencySymbol";
import { useAlert } from "@/app/hooks/useAlert";
import { Currency } from "@/app/generated/prisma/enums";

const ShipmentFinancialDashboard = () => {
    const [data, setData] = useState<any>(null);
    const { showProcessing, closeProcessing } = useAlert();
    const [inputYear, setInputYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            showProcessing();
            try {
                const params = new URLSearchParams({
                    startYear: inputYear.toString(),
                    startMonth: selectedMonth === "all" ? "1" : selectedMonth.toString(),
                    endYear: inputYear.toString(),
                    endMonth: selectedMonth === "all" ? "12" : selectedMonth.toString(),
                });

                if (selectedMonth !== "all") {
                    params.append("groupBy", "day");
                }

                const response = await fetch(`/api/dashboard/shipment-finance?${params}`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    setData(null);
                }
            } catch (error) {
                setData(null);
            } finally {
                closeProcessing();
            }
        };

        fetchData();
    }, [inputYear, selectedMonth]);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Prepare chart data
    const rawDataList = selectedMonth === "all" ? (data?.monthly || []) : (data?.daily || []);

    // 2. ทำการ Sort ข้อมูลตามลำดับเวลา (จากน้อยไปมาก) 
    // เพื่อให้กราฟแสดงจากวันที่ 1 -> 31 หรือจาก ม.ค. -> ธ.ค.
    const sortedData = [...rawDataList].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return (a.day || 0) - (b.day || 0);
    });

    // 3. นำข้อมูลที่ Sort แล้วมา map เข้า chartData
    const chartData = sortedData.map((item: any) => ({
        label: selectedMonth === "all"
            ? monthNames[item.month - 1]
            : `Day ${item.day}`,
        income: item.totalIncome,
        paid: item.totalPaid,
        unpaid: item.totalUnpaid,
        cost: item.totalCost // ถ้าเป็นหน้า Monthly-Finance
    }));

    const COLORS = {
        income: "#6366f1", // Indigo
        paid: "#10b981",   // Emerald
        unpaid: "#f59e0b", // Amber
    };

    const viewMode = selectedMonth === "all" ? "Monthly" : "Daily";

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center border border-slate-200">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">No Shipment Data</h2>
                    <p className="text-slate-500">Could not find financial records for the selected period.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Shipment Finance</h1>
                            <p className="text-slate-500 text-sm font-medium">Tracking logistics revenue & collection</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex items-center">
                            <Calendar className="w-4 h-4 absolute left-3 text-slate-400" />
                            <input
                                type="number"
                                value={inputYear}
                                onChange={(e) => setInputYear(Number(e.target.value))}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none w-32"
                            />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="all">Full Year (Monthly)</option>
                            {monthNames.map((month, index) => (
                                <option key={index + 1} value={index + 1}>{month} (Daily)</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Value"
                        value={formatCurrency(data.summary.totalIncome)}
                        subtitle={`${data.summary.totalShipments} Shipments`}
                        icon={<DollarSign className="w-5 h-5" />}
                        color="bg-indigo-500"
                    />
                    <StatCard
                        title="Collected"
                        value={formatCurrency(data.summary.totalPaid)}
                        subtitle="Received payment"
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        title="Outstanding"
                        value={formatCurrency(data.summary.totalUnpaid)}
                        subtitle="Pending collection"
                        icon={<AlertCircle className="w-5 h-5" />}
                        color="bg-amber-500"
                    />
                    <StatCard
                        title="Avg. / Shipment"
                        value={formatCurrency(data.summary.totalIncome / (data.summary.totalShipments || 1))}
                        subtitle="Average value"
                        icon={<TrendingUp className="w-5 h-5" />}
                        color="bg-slate-700"
                    />
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6">{viewMode} Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(val: number | undefined) => val !== undefined ? formatCurrency(val) : ''}
                                />
                                <Area type="monotone" dataKey="income" stroke={COLORS.income} strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-6">Payment Status</h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Paid", value: data.summary.totalPaid },
                                            { name: "Unpaid", value: data.summary.totalUnpaid },
                                        ]}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill={COLORS.paid} />
                                        <Cell fill={COLORS.unpaid} />
                                    </Pie>
                                    <Tooltip formatter={(val: number | undefined) => val !== undefined ? formatCurrency(val) : ''} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-500"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Paid</span>
                                <span className="font-bold text-slate-700">{((data.summary.totalPaid / data.summary.totalIncome) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-500"><div className="w-3 h-3 rounded-full bg-amber-500" /> Unpaid</span>
                                <span className="font-bold text-slate-700">{((data.summary.totalUnpaid / data.summary.totalIncome) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6">Shipment Volume ({viewMode})</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Shipments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6">Collection Tracking</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="unpaid" stroke={COLORS.unpaid} strokeWidth={2} dot={{ fill: COLORS.unpaid }} name="Outstanding" />
                                <Line type="monotone" dataKey="paid" stroke={COLORS.paid} strokeWidth={2} dot={{ fill: COLORS.paid }} name="Collected" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for KPI Cards
const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className={`${color} p-3 rounded-xl text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">{subtitle}</p>
            </div>
        </div>
    </div>
);

export default ShipmentFinancialDashboard;