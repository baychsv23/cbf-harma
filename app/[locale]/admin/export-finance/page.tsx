"use client";
import React, { useState, useEffect } from "react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
    TrendingUp, DollarSign, Receipt, Calendar,
    Package, AlertCircle, Coins
} from "lucide-react";
import { formatCurrency } from "@/lib/getCurrencySymbol";
import { useAlert } from "@/app/hooks/useAlert";
import { Currency } from "@/app/generated/prisma/enums";

const COLORS = {
    income: "#3b82f6",
    paid: "#10b981",
    unpaid: "#f59e0b",
    grid: "#e2e8f0",
    usd: "#8b5cf6",
    thb: "#ec4899",
    lak: "#3b82f6"
};

interface FinanceData {
    year: number;
    month: number;
    day?: number;
    totalIncomeLAK: number;
    totalPaidLAK: number;
    totalUnpaidLAK: number;
    origUSD: number;
    origTHB: number;
    origLAK: number;
}

const ExportFinancialDashboard = () => {
    const [data, setData] = useState<any>(null);
    const { showProcessing, closeProcessing } = useAlert();
    const [inputYear, setInputYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
    const [selectedCustomer, setSelectedCustomer] = useState("all");
    const [customers, setCustomers] = useState<any[]>([]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        const loadCustomers = async () => {
            const response = await fetch("/api/customers");
            const result = await response.json();
            if (result.success) setCustomers(result.data || []);
        };
        loadCustomers();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            showProcessing();
            try {
                const params = new URLSearchParams({
                    startYear: inputYear.toString(),
                    endYear: inputYear.toString(),
                    startMonth: selectedMonth === "all" ? "1" : selectedMonth.toString(),
                    endMonth: selectedMonth === "all" ? "12" : selectedMonth.toString(),
                    groupBy: selectedMonth === "all" ? "month" : "day"
                });
                if (selectedCustomer !== "all") params.append("customerId", selectedCustomer);

                const response = await fetch(`/api/dashboard/export-finance?${params}`);
                const result = await response.json();
                setData(result.success ? result.data : null);
            } catch (error) {
                setData(null);
            } finally {
                closeProcessing();
            }
        };
        fetchData();
    }, [inputYear, selectedMonth, selectedCustomer]);

    if (!data) return <div className="p-10 text-center text-slate-500 font-medium">Loading financial data...</div>;

    const rawData: FinanceData[] = selectedMonth === "all"
        ? (data?.monthly || [])
        : (data?.daily || []);

    const sortedData = [...rawData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return (a.day || 0) - (b.day || 0);
    });

    const chartData = sortedData.map((item) => ({
        label: selectedMonth === "all"
            ? monthNames[item.month - 1]
            : `${item.day}/${item.month}`,
        income: item.totalIncomeLAK,
        paid: item.totalPaidLAK,
        unpaid: item.totalUnpaidLAK,
    }));

    const SummaryCard = ({ title, value, sub, icon: Icon, gradient }: any) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}>
            <div className="flex justify-between items-start mb-4">
                <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner"><Icon className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-black tracking-tight">{formatCurrency(value)}</p>
            <p className="text-white/60 text-xs mt-1 font-medium italic opacity-80">{sub}</p>
        </div>
    );

    const collectionRate = data.summary.totalIncomeLAK > 0
        ? ((data.summary.totalPaidLAK / data.summary.totalIncomeLAK) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                <Package className="text-white" size={24} />
                            </div>
                            Export Financials
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Real-time revenue tracking in LAK (Base Currency)</p>
                    </div>

                    <div className="flex flex-wrap gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 px-4 border-r border-slate-100">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <input
                                type="number"
                                value={inputYear}
                                onChange={(e) => setInputYear(Number(e.target.value))}
                                className="w-16 outline-none font-bold text-slate-700 text-sm bg-transparent"
                            />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                            className="outline-none bg-transparent text-sm font-bold text-slate-600 px-2 cursor-pointer hover:text-blue-600 transition-colors"
                        >
                            <option value="all">Yearly Overview</option>
                            {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="outline-none bg-blue-50 text-blue-700 text-xs font-black rounded-full px-5 py-2 transition-all hover:bg-blue-100 border-none appearance-none cursor-pointer"
                        >
                            <option value="all">ALL CUSTOMERS</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <SummaryCard title="Total Revenue" value={data.summary.totalIncomeLAK} sub={`${data.summary.totalInvoices} Export Invoices`} icon={DollarSign} gradient="from-slate-800 to-slate-900" />
                    <SummaryCard title="Total Collected" value={data.summary.totalPaidLAK} sub="Payment completed" icon={TrendingUp} gradient="from-blue-600 to-blue-700" />
                    <SummaryCard title="Outstanding" value={data.summary.totalUnpaidLAK} sub="Awaiting settlement" icon={AlertCircle} gradient="from-orange-500 to-orange-600" />
                    <SummaryCard title="Average / Period" value={data.summary.totalIncomeLAK / (data.summary.dataCount || 1)} sub="Filtered performance" icon={Receipt} gradient="from-indigo-500 to-purple-600" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Main Trend Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Revenue & Collection Trend (LAK)</h3>
                            <div className="flex gap-4 text-[10px] font-bold">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> REVENUE</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> COLLECTED</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                                    formatter={(value: number | undefined) => value !== undefined ? [formatCurrency(value)] : ['']}
                                />
                                <Area type="monotone" dataKey="income" stroke={COLORS.income} strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="paid" stroke={COLORS.paid} strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status & Currency Mix */}
                    <div className="space-y-8">
                        {/* Payment Status Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 text-left">Payment Status</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Collected", value: data.summary.totalPaidLAK },
                                            { name: "Outstanding", value: data.summary.totalUnpaidLAK }
                                        ]}
                                        innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none"
                                    >
                                        <Cell fill={COLORS.paid} />
                                        <Cell fill={COLORS.unpaid} />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-800 tracking-tighter">{collectionRate}%</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Collection Rate</p>
                            </div>
                        </div>

                        {/* Currency Breakdown Card */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                            <h3 className="font-black text-white/50 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                                <Coins size={14} /> Original Currency Mix
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/30">LAK</div>
                                        <span className="text-xs font-bold text-white/70 tracking-wide">Laotian Kip</span>
                                    </div>
                                    <span className="font-black text-sm">{formatCurrency(data.summary.totalLAK)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xs border border-pink-500/30">THB</div>
                                        <span className="text-xs font-bold text-white/70 tracking-wide">Thai Baht</span>
                                    </div>
                                    <span className="font-black text-sm">{formatCurrency(data.summary.totalTHB, Currency.THB)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs border border-purple-500/30">USD</div>
                                        <span className="text-xs font-bold text-white/70 tracking-wide">US Dollar</span>
                                    </div>
                                    <span className="font-black text-sm">{formatCurrency(data.summary.totalUSD, Currency.USD)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unpaid Bar Chart */}
                {/* Unpaid Bar Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-8 flex items-center gap-2 text-orange-500">
                        <AlertCircle size={16} /> Monthly Unpaid Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />

                            {/* 1. ปรับการแสดงผลที่แกน Y เป็นหน่วย k หรือ M */}
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`}
                            />

                            {/* 2. ปรับการแสดงผลใน Tooltip ให้มีคอมม่า (toLocaleString) */}
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(value: number | undefined) => value !== undefined ? [formatCurrency(value)] : ['']}
                            />

                            <Legend verticalAlign="top" align="right" iconType="circle" />

                            <Bar
                                dataKey="unpaid"
                                fill={COLORS.unpaid}
                                radius={[6, 6, 0, 0]}
                                name="Outstanding"
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ExportFinancialDashboard;