"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  Eye,
  Globe,
  Calendar,
} from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import Swal from "sweetalert2";
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

export default function ArticlePage() {
  const t = useTranslations();
  const local = useLocale();
  const api = useApiWithAlert();

  const {
    showSuccess,
    showError,
    showConfirm,
    showProcessing,
    closeProcessing,
  } = useAlert();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState({ title: "", type: "", status: "" });
  const [allProducts, setAllProducts] = useState<any[]>([]); // สำหรับเลือก Tie-in Products

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
  // โหลดสินค้าทั้งหมดเพื่อมาทำ Selection (Tie-in)
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get("/api/products");
      setAllProducts(data.data || []);
    };
    fetchProducts();
  }, []);

  const handleApplyFilters = () => {
    applyFilters({ title: search.title, type: search.type, status: search.status });
  };

  const handleClearFilters = () => {
    setSearch({ title: "", type: "", status: "" });
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

    if (selectedArticle) {
      await api.put(`/api/articles/${selectedArticle.id}`, formData)
    }
    else {
      await api.post("/api/articles", formData);
    }
    setIsModalOpen(false);
    reloadData();
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (article: any) => {
    const isConfirmed = await showConfirm(
      t(translations.confirmDelete, {
        name: local === "lo" ? article.titleLA : article.titleEN,
      }),
    );

    if (isConfirmed) {
      showProcessing();
      try {
        const response = await api.delete(`/api/articles/${article.id}`);
        closeProcessing();
        if (response.data.success) {
          showSuccess(t(response.data.message));
          reloadData();
        } else {
          showError(t(response.data.message));
        }
      } catch (error: any) {
        closeProcessing();
        showError(t(error?.response?.data?.message || translations.unknown));
      }
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
          <span>{t(translations.Management, { name: t(translations.article) })} </span>
        </h1>

        {hasPermission(Permission.ARTICLE_CREATE) && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            {t(translations.Create, { name: t(translations.article) })}
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              Title Search
            </label>
            <input
              type="text"
              placeholder="Search by title..."
              value={search.title}
              onChange={(e) => setSearch({ ...search, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              Type
            </label>
            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">All Types</option>
              {Object.values(ArticleType).map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-64">
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
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-all"
            >
              {t(translations.clear)}
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-all shadow-md"
            >
              <Search size={18} />
              {t(translations.apply)}
            </button>
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
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  ARTICLE INFO
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  TYPE
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  STATS
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">
                  ACTIONS
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
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">#{article.stt}</td>
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
                            {local === "lo" ? article.titleLA : article.titleEN}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Globe size={10} />{" "}
                            {local === "lo" ? article.titleEN : article.titleLA}
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
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                      >
                        {t(article.status)}
                      </span>
                      {article.publishedAt && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(article.publishedAt)}
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
      />
    </div>
  );
}
