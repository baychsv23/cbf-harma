"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Megaphone,
  ImageIcon,
  Eye,
  EyeOff,
  RefreshCcw,
} from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import { useAlert } from "@/app/hooks/useAlert";
import { useAuth } from "@/app/hooks/useAuth";
import { usePagination } from "@/app/hooks/usePagination";
import { useTranslations } from "next-intl";
import { BooleanState, ImageType, Permission } from "@/generated/prisma/enums"; // Adjust import path
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

import Image from "next/image";
import { translations } from "@/lib/translation";
import AnnouncementFormModal from "@/components/Form/AnnouncementFormModal";
import { formatDate } from "@/lib/formateData";
import { FilterActions } from "@/components/UI/FilterActions";

export default function AnnouncementPage() {
  const t = useTranslations();
  const { showConfirm, showProcessing } = useAlert();
  const api = useApiWithAlert();
  const { hasPermission } = useAuth();

  // Filter state
  const [filterType, setFilterType] = useState<string>("");

  // Pagination Hook
  const {
    items: announcements,
    pagination,
    loading,
    page,
    setPage,
    reloadData,
    applyFilters,
    clearFilters,
  } = usePagination("/api/announcements");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    // Note: formData here should be a FormData object if uploading files,
    // or JSON if handling base64/urls. Assuming JSON for consistency with your snippet.
    showProcessing();
    if (selectedItem) {
      await api.put(`/api/announcements/${selectedItem.id}`, formData);
    } else {
      await api.post("/api/announcements", formData);
    }
    setIsModalOpen(false);
    reloadData();
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm(t(translations.confirmDelete));
    if (isConfirmed) {
      showProcessing();
      await api.delete(`/api/announcements/${id}`);
      reloadData();
    }
  };

  const handleApplyFilters = () => {
    applyFilters({ type: filterType });
  };

  const handleClearFilters = () => {
    setFilterType("");
    clearFilters();
  };
  const bannerCount = announcements.filter(
    (item) => item.type === ImageType.BANNER,
  ).length;

  const announcementCount = announcements.filter(
    (item) => item.type === ImageType.ANNOUNCEMENT,
  ).length;
  const shouldHideButton = bannerCount >= 5 && announcementCount >= 1;

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Megaphone className="text-accent" />
          {t(translations.Management, { name: t(translations.announcement) })}
        </h1>
        {hasPermission(Permission.ANNOUNCEMENT_CREATE) &&
          !shouldHideButton && ( // Ensure you have this permission or similar
            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
              <Plus size={18} />
              {t(translations.Create, { name: t(translations.announcement) })}
            </button>
          )}
      </div>

      {/* --- Filters --- */}
      <div className="mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t(translations.Filter, { name: t(translations.announcement) })}
        </h2>

        {/* Grid Layout matches ProductPage */}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-xl">
            <label className="text-xs font-bold text-slate-500 ml-1">
              {t(translations.type)}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            >
              <option value="">{t(translations.All, { name: "" })}</option>
              {Object.values(ImageType).map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-xl">
          </div>
          {/* Spacer divs to keep grid alignment consistent if you add more filters later */}

          <FilterActions
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 w-20">
                {t(translations.stt)}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                {t(translations.preview)}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                {t(translations.type)}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                {t(translations.createdAt)}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                {t(translations.status)}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">
                {t(translations.actions)}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {announcements.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  {t(translations.noData)}
                </td>
              </tr>
            ) : (
              (announcements as any[]).map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-500">{item.stt}</td>
                  <td className="px-6 py-4">
                    <div className="relative w-32 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt="Banner"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          loading="eager"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold border ${item.type === ImageType.BANNER
                        ? "bg-purple-50 text-purple-600 border-purple-100"
                        : "bg-primary/10 text-primary border-primary/20"
                        }`}
                    >
                      {t(item.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                                                    inline-flex items-center gap-1.5
                                                    rounded-full px-3 py-1
                                                    text-xs font-semibold
                                                    transition-colors
                                                    ${item.isPublic ===
                          BooleanState.TRUE
                          ? "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }
                                        `}
                    >
                      {item.isPublic === BooleanState.TRUE ? (
                        <>
                          <Eye size={14} className="opacity-80" />
                          {t(translations.active)}
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} className="opacity-70" />
                          {t(translations.inactive)}
                        </>
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          page={page}
          setPage={setPage}
          loading={loading}
        />
      )}

      {/* --- Modal Form --- */}
      <AnnouncementFormModal
        t={t}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={selectedItem}
      />
    </div>
  );
}
