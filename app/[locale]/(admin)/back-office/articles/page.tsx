"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Eye,
  Globe,
  Calendar,
} from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import { useAlert } from "@/app/hooks/useAlert";
import { useAuth } from "@/app/hooks/useAuth";
import { usePagination } from "@/app/hooks/usePagination";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import {
  Permission,
  ArticleType,
  ArticleStatus,
} from "@/generated/prisma/enums"; // Import Enum

import { formatDate } from "@/lib/formateData";
import ArticleFormModal from "@/components/Form/ArticleFormModal";
import { isEnglish } from "@/lib/utils/locale";
import { FilterActions } from "@/components/UI/FilterActions";
import { api } from "@/lib/axios";
const STATUS_STYLES: Record<string, string> = {
  [ArticleStatus.PUBLISHED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  DEFAULT: "bg-slate-50 text-slate-500 border-slate-200",
};
export default function ArticlePage() {
  const t = useTranslations();
  const local = useLocale();

  const { showConfirm, showProcessing } = useAlert();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState({
    title: "",
    type: "",
    status: "",
    year: "",
    month: "",
  });
  // โหลด Pagination
  const {
    items: articles,
    pagination,
    loading,
    page,
    setPage,
    reloadData,
    applyFilters,
    clearFilters,
    filters,
  } = usePagination("/articles", { sortField: "createdAt", sortOrder: "desc" });

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  // โหลดสินค้าทั้งหมดเพื่อมาทำ Selection (Tie-in)

  const fetchProducts = async (page: number) => {
    const { data } = await api.get(`/products/list?page=${page}`);
    if (data.success) {
      setAllProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data],
      );
      setHasMoreProducts(data.pagination.hasNext);
    }
  };
  // โหลดครั้งแรก
  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleLoadMoreProducts = () => {
    const nextPage = productPage + 1;
    setProductPage(nextPage);
    fetchProducts(nextPage);
  };

  const handleApplyFilters = () => {
    applyFilters({
      title: search.title,
      type: search.type,
      status: search.status,
      year: search.year,
      month: search.month,
      sortField: filters?.sortField,
      sortOrder: filters?.sortOrder,
    });
  };

  const handleClearFilters = () => {
    setSearch({ title: "", type: "", status: "", year: "", month: "" });
    applyFilters({ sortField: "createdAt", sortOrder: "desc" });
  };

  const handleSort = (field: string) => {
    const isCurrentField = filters?.sortField === field;
    const defaultOrder = field === "title" || field === "type" || field === "status" ? "asc" : "desc";
    const newOrder = isCurrentField
      ? filters?.sortOrder === "asc"
        ? "desc"
        : "asc"
      : defaultOrder;

    applyFilters({
      ...filters,
      sortField: field,
      sortOrder: newOrder,
    });
  };

  const renderSortIcon = (field: string) => {
    if (filters?.sortField !== field) {
      return <span className="text-slate-300 ml-1 text-xs">↕</span>;
    }
    return filters?.sortOrder === "asc" ? (
      <span className="text-emerald-600 font-bold ml-1 text-xs">▲</span>
    ) : (
      <span className="text-emerald-600 font-bold ml-1 text-xs">▼</span>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const handleOpenCreate = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // --- FORM LOGIC ---
  const handleSaveArticle = async (formData: any) => {
    showProcessing();
    if (selectedArticle) {
      await api.put(`/articles/${selectedArticle.id}`, formData);
    } else {
      await api.post("/articles", formData);
    }
    setIsModalOpen(false);
    reloadData();
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (article: any) => {
    const isConfirmed = await showConfirm(
      t(translations.confirmDelete, {
        name: isEnglish(local) ? article.titleEN : article.titleLA,
      }),
    );

    if (isConfirmed) {
      showProcessing();

      await api.delete(`/articles/${article.id}`);
      reloadData();
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <FileText className="text-indigo-600 w-6 h-6" />
          </div>
          <span>
            {t(translations.Management, { name: t(translations.article) })}{" "}
          </span>
        </h1>

        {hasPermission(Permission.ARTICLE_CREATE) && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            {t(translations.Create, { name: t(translations.article) })}
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t(translations.Filter, { name: t(translations.article) })}
        </h2>

        {/* Added flex-wrap to allow filters to flow to a second line if needed */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
          {/* 1. Title - flexible width */}
          <div className="flex-1 min-w-[200px] w-full">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.title)}
            </label>
            <input
              type="text"
              placeholder={t(translations.SearchBy, {
                name: t(translations.title),
              })}
              value={search.title}
              onChange={(e) => setSearch({ ...search, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* 2. Type */}
          <div className="w-full md:w-48">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.type)}
            </label>
            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">
                {t(translations.All, { name: t(translations.article) })}
              </option>
              {Object.values(ArticleType).map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Status */}
          <div className="w-full md:w-48">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.status)}
            </label>
            <select
              value={search.status}
              onChange={(e) => setSearch({ ...search, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">
                {t(translations.All, { name: t(translations.status) })}
              </option>
              {Object.values(ArticleStatus).map((s) => (
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Year - Adjusted width */}
          <div className="w-full md:w-28">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.year)}
            </label>
            <input
              type="number"
              placeholder="YYYY"
              min="2025"
              max={new Date().getFullYear() + 1}
              value={search.year}
              onChange={(e) => setSearch({ ...search, year: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* 5. Month - Adjusted width */}
          <div className="w-full md:w-40">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.month)}
            </label>
            <select
              value={search.month}
              onChange={(e) => setSearch({ ...search, month: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">{t(translations.All, { name: "" })}</option>
              {[
                translations.january,
                translations.february,
                translations.march,
                translations.april,
                translations.may,
                translations.june,
                translations.july,
                translations.august,
                translations.september,
                translations.october,
                translations.november,
                translations.december,
              ].map((monthKey, i) => (
                <option key={i + 1} value={i + 1}>
                  {t(monthKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="w-full md:w-auto">
            <FilterActions
              onClear={handleClearFilters}
              onApply={handleApplyFilters}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 w-12 select-none">
                  {t(translations.stt)}
                </th>
                <th
                  onClick={() => handleSort("title")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {t(translations.article)}
                    {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("type")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 w-28 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {t(translations.type)}
                    {renderSortIcon("type")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 w-28 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {t(translations.status)}
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("publishedAt")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 w-36 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {t(translations.publishAt)}
                    {renderSortIcon("publishedAt")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("views")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 w-24 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {t(translations.views)}
                    {renderSortIcon("views")}
                  </div>
                </th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                /* Skeleton rows */
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-4 py-3">
                      <div className="h-3 w-6 bg-slate-100 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-9 bg-slate-100 rounded-md animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
                          <div className="h-2.5 w-28 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileText size={32} strokeWidth={1.2} />
                      <span className="text-sm">{t(translations.noData)}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                (articles as any[]).map((article) => {
                  const title = isEnglish(local)
                    ? article.titleEN
                    : article.titleLA;
                  const statusClass =
                    STATUS_STYLES[article.status] ?? STATUS_STYLES.DEFAULT;

                  return (
                    <tr
                      key={article.id}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* # */}
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {article.stt.toString().padStart(2, "0")}
                      </td>

                      {/* Article info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-14 h-9 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-100">
                            {article.coverImage ? (
                              <img
                                src={article.coverImage}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <FileText size={14} />
                              </div>
                            )}
                          </div>

                          {/* Text */}
                          <div>
                            <p className="font-medium text-slate-800 line-clamp-1 leading-snug">
                              {title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {t(translations.createdBy)}:{" "}
                              <span className="text-slate-500">
                                {article.createdBy?.fullName || "-"}
                              </span>{" "}
                              · {formatDate(article.createdAt)}
                            </p>
                            {article.updatedBy && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {t(translations.updatedBy)}:{" "}
                                <span className="text-slate-500">
                                  {article.updatedBy?.fullName || "-"}
                                </span>{" "}
                                · {formatDate(article.updatedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">
                          {t(article.type)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusClass}`}
                        >
                          {t(article.status)}
                        </span>
                      </td>

                      {/* Publish date */}
                      <td className="px-4 py-3">
                        {article.publishedAt ? (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={11} className="text-slate-300" />
                            {formatDate(article.publishedAt)}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Eye size={12} className="text-slate-300" />
                          {article.views.toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {hasPermission(Permission.ARTICLE_UPDATE) && (
                            <button
                              onClick={() => handleOpenEdit(article)}
                              className="p-1.5 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
                              title={t(translations.edit )}
                            >
                              <Edit size={15} />
                            </button>
                          )}
                          {hasPermission(Permission.ARTICLE_DELETE) && (
                            <button
                              onClick={() => handleDelete(article)}
                              className="p-1.5 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
                              title={t(translations.delete)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            pagination={pagination}
            page={page}
            setPage={setPage}
            loading={loading}
          />
        </div>
      )}

      <ArticleFormModal
        t={t}
        local={local}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveArticle}
        initialData={selectedArticle}
        allProducts={allProducts}
        onLoadMoreProducts={handleLoadMoreProducts}
        hasMoreProducts={hasMoreProducts}
      />
    </div>
  );
}
