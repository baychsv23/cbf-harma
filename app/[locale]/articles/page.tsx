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
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { formatDate } from "@/lib/formateData";
import ArticleFormModal from "@/components/Form/ArticleFormModal";
import { isEnglish } from "@/lib/utils/locale";
import { FilterActions } from "@/components/UI/FilterActions";

export default function ArticlePage() {
  const t = useTranslations();
  const local = useLocale();
  const api = useApiWithAlert();

  const { showConfirm, showProcessing } = useAlert();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState({ title: "", type: "", status: "", year: "", month: "" });
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
  } = usePagination("/api/articles");



  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  // โหลดสินค้าทั้งหมดเพื่อมาทำ Selection (Tie-in)


  const fetchProducts = async (page: number) => {
    const { data } = await api.get(`/api/products/list?page=${page}`);
    if (data.success) {
      setAllProducts((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
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
      month: search.month
    });
  };

  const handleClearFilters = () => {
    setSearch({ title: "", type: "", status: "", year: "", month: "" });
    clearFilters();
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
      await api.put(`/api/articles/${selectedArticle.id}`, formData);
    } else {
      await api.post("/api/articles", formData);
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

      await api.delete(`/api/articles/${article.id}`);
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
              placeholder={t(translations.SearchBy, { name: t(translations.title) })}
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
              <option value="">{t(translations.All, { name: t(translations.article) })}</option>
              {Object.values(ArticleType).map((type) => (
                <option key={type} value={type}>{t(type)}</option>
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
              <option value="">{t(translations.All, { name: t(translations.status) })}</option>
              {Object.values(ArticleStatus).map((s) => (
                <option key={s} value={s}>{t(s)}</option>
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
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.stt)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.Info, { name: t(translations.article) })}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.type)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.status)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  STATS
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">
                  {t(translations.actions)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    {t(translations.noData)}
                  </td>
                </tr>
              ) : (
                (articles as any[]).map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-primary-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">{article.stt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          {article.coverImage ? (
                            <img
                              src={article.coverImage}
                              className="w-full h-full object-cover"
                              alt="cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FileText size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 line-clamp-1">
                            {isEnglish(local)
                              ? article.titleEN
                              : article.titleLA}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Globe size={10} />{" "}
                            {isEnglish(local)
                              ? article.titleLA
                              : article.titleEN}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {t(article.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${article.status === ArticleStatus.PUBLISHED
                          ? "bg-secondary-100/80 text-secondary-700 border-secondary-300"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                      >
                        {t(article.status)}
                      </span>
                      {article.publishedAt && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={10} />{" "}
                          {formatDate(article.publishedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Eye size={14} className="text-slate-400" />{" "}
                        {article.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {hasPermission(Permission.ARTICLE_UPDATE) && (
                          <button
                            onClick={() => handleOpenEdit(article)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission(Permission.ARTICLE_DELETE) && (
                          <button
                            onClick={() => handleDelete(article)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          page={page}
          setPage={setPage}
          loading={loading}
        />
      )}
      <ArticleFormModal
        t={t}
        local={local}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveArticle}
        initialData={selectedArticle}
        allProducts={allProducts}
        onLoadMoreProducts={handleLoadMoreProducts} // ส่งฟังก์ชันไปให้ Modal
        hasMoreProducts={hasMoreProducts}
      />
    </div>
  );
}
