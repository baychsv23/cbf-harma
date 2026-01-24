"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Receipt, Calendar,
  Building2, AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/getCurrencySymbol";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { useAlert } from "@/app/hooks/useAlert";

// --- Interfaces ---
interface FinanceItem {
  year: number;
  month: number;
  day?: number;
  totalCost: number;
  totalIncome: number;
  totalPaid: number;
  totalUnpaid: number;
}

interface DashboardData {
  monthly?: FinanceItem[];
  daily?: FinanceItem[];
  summary: {
    totalCost: number;
    totalIncome: number;
    totalPaid: number;
    totalUnpaid: number;
    totalInvoices: number;
    dataCount: number;
  };
}

const TaxFinancialDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [customers, setCustomers] = useState<any[]>([]);

  const { showProcessing, closeProcessing } = useAlert();
  const api = useApiWithAlert();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const loadCustomers = async () => {
      const res = await api.get("/api/customers");
      setCustomers(res.data?.data || []);
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

        const response = await fetch(`/api/dashboard/tax-finance?${params}`);
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

  // --- Logic Helpers ---
  const rawDataList = selectedMonth === "all" ? (data?.monthly || []) : (data?.daily || []);

  const chartData = rawDataList.map((item) => ({
    label: selectedMonth === "all" ? monthNames[item.month - 1] : `Day ${item.day}`,
    cost: item.totalCost,
    income: item.totalIncome,
    profit: item.totalPaid,
  }));

  const summary = data?.summary || { totalCost: 0, totalIncome: 0, totalPaid: 0, totalUnpaid: 0, totalInvoices: 0, dataCount: 1 };
  const profitMargin = ((summary.totalPaid / (summary.totalIncome || 1)) * 100).toFixed(1);
  const avgProfit = (summary.totalPaid / (summary.dataCount || 1)).toFixed(0);
  const viewMode = selectedMonth === "all" ? "Monthly" : "Daily";

  if (!data) return <div className="p-10 text-center"><AlertCircle className="mx-auto mb-2" /> No Data Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Financial Insights</h1>
          <p className="text-slate-500">Monitoring {viewMode} performance & cost structures</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Calendar className="text-blue-500 ml-2" />
            <input
              type="number" value={inputYear}
              onChange={(e) => setInputYear(Number(e.target.value))}
              className="bg-transparent w-full focus:outline-none font-bold"
            />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Calendar className="text-purple-500 ml-2" />
            <select
              className="bg-transparent w-full focus:outline-none font-bold"
              value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              <option value="all">All Months</option>
              {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Building2 className="text-indigo-500 ml-2" />
            <select
              className="bg-transparent w-full focus:outline-none font-bold text-ellipsis"
              value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="all">Every Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Revenue" value={summary.totalIncome} icon={DollarSign} color="blue" />
          <StatCard title="Net Profit" value={summary.totalPaid} sub={`Margin: ${profitMargin}%`} icon={TrendingUp} color="emerald" />
          <StatCard title="Outstanding" value={summary.totalUnpaid} icon={AlertCircle} color="amber" />
          <StatCard title="Operating Cost" value={summary.totalCost} sub={`${summary.totalInvoices} Invoices`} icon={TrendingDown} color="rose" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-6">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} dot={false} name="Revenue" />
                <Line type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={3} dot={false} name="Expense" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-6">Profit vs Cost</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Profit", value: summary.totalPaid },
                    { name: "Expense", value: summary.totalCost }
                  ]}
                  innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---
const StatCard = ({ title, value, sub, icon: Icon, color }: any) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {sub && <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full uppercase">{sub}</span>}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(value)}</p>
    </div>
  );
};

export default TaxFinancialDashboard;