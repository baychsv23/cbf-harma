"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type PaginationProps = {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  page: number;
  setPage: (page: number) => void;
  loading?: boolean;
};

export default function Pagination({
  pagination,
  page,
  setPage,
  loading = false,
}: PaginationProps) {
  // ซ่อนถ้าไม่มีหน้าอื่นให้ไป หรือกำลังโหลดแบบ Full page (แต่ถ้า loading state แค่ table จางๆ ก็โชว์ได้)
  if (pagination.totalPages <= 1) return null;
  return (
    <div className="mt-6 py-3 px-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
      {/* 🟢 ส่วนแสดงข้อมูล (Information) */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="hidden sm:inline">Showing page</span>
        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
          {pagination.currentPage}
        </span>
        <span>of</span>
        <span className="font-bold text-gray-900">{pagination.totalPages}</span>
        <span className="text-gray-400 mx-1">|</span>
        <span className="text-gray-600">
          Total{" "}
          <span className="font-semibold text-blue-600">
            {pagination.totalItems}
          </span>{" "}
          items
        </span>
      </div>

      {/* 🟠 ส่วนปุ่มควบคุม (Controls) */}
      <div className="flex items-center gap-2">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => setPage(page - 1)}
          disabled={!pagination.hasPrev || loading}
          className="group flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          title="Previous Page"
        >
          {loading && !pagination.hasNext && !pagination.hasPrev ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ChevronLeft size={20} strokeWidth={2.5} className="mr-0.5" />
          )}
        </button>

        {/* (Optional) แสดงเลขหน้าแบบปุ่มตรงกลาง - สำหรับ UI แบบง่าย */}
        <div className="hidden sm:flex gap-1">
          {/* แสดงหน้าปัจจุบัน */}
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-200">
            {page}
          </div>
        </div>

        {/* ปุ่มถัดไป */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={!pagination.hasNext || loading}
          className="group flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          title="Next Page"
        >
          {loading && pagination.hasNext ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ChevronRight size={20} strokeWidth={2.5} className="ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
