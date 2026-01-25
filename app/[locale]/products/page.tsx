"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Settings2,
  Pill,
  Activity,
  Stethoscope,
} from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import Swal from "sweetalert2";
import { useAlert } from "@/app/hooks/useAlert";
import { useAuth } from "@/app/hooks/useAuth";
import { usePagination } from "@/app/hooks/usePagination";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import {
  BooleanState,
  Category,
  CategorySub,
  Permission,
} from "@/generated/prisma/enums";
import Script from "next/script";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import ProductFormModal from "@/components/Form/ProductFormModal";

export default function ProductPage() {
  const t = useTranslations();
  const local = useLocale();
  const { showConfirm, showProcessing } = useAlert();
  const api = useApiWithAlert();
  const { hasPermission } = useAuth();

  const [search, setSearch] = useState({
    name: "",
    category: "",
    categorySub: "",
  });
  const [allSymptoms, setAllSymptoms] = useState<any[]>([]);

  const {
    items: products,
    pagination,
    loading,
    page,
    setPage,
    reloadData,
    applyFilters,
    clearFilters,
  } = usePagination("/api/products");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData: any) => {
    setIsProcessing(true);
    try {
      if (selectedProduct) {
        await api.put(`/api/products/${selectedProduct.id}`, formData);
      } else {
        await api.post("/api/products", formData);
      }
      setIsModalOpen(false);
      reloadData();
    } catch (error: any) {
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchSymptoms = async () => {
      const { data } = await api.get("/api/symptoms"); // ต้องมี API นี้
      setAllSymptoms(data.data || []);
    };
    fetchSymptoms();
  }, []);
  const handleApplyFilters = () => {
    applyFilters({
      name: search.name,
      category: search.category,
      categorySub: search.categorySub,
    });
  };

  const handleClearFilters = () => {
    setSearch({ name: "", category: "", categorySub: "" });
    clearFilters();
  };
  // Helper to get enum translations or raw keys

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />
      {/* Header section identical to yours but with updated Permission enum */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Pill className="text-blue-600" /> {t(translations.product)}
        </h1>
        {hasPermission(Permission.PRODUCT_CREATE) && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Plus size={18} />{" "}
            {t(translations.Create, { name: t(translations.product) })}
          </button>
        )}
      </div>
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t(translations.Filter, { name: t(translations.product) })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ค้นหาด้วยชื่อ */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">
              NAME / SKU
            </label>
            <input
              type="text"
              placeholder={t(translations.SearchBy, {
                name: t(translations.name),
              })}
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* ค้นหาด้วยหมวดหมู่หลัก */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">
              CATEGORY
            </label>
            <select
              value={search.category}
              onChange={(e) =>
                setSearch({
                  ...search,
                  category: e.target.value,
                  categorySub: "",
                })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">
                {t(translations.All, { name: t(translations.category) })}
              </option>
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* ค้นหาด้วยหมวดหมู่ย่อย (แสดงเฉพาะเมื่อเลือก ANTIBIOTICS) */}
          {search.category === Category.ANTIBIOTICS && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 ml-1">
                SUB-CATEGORY
              </label>
              <select
                value={search.categorySub}
                onChange={(e) =>
                  setSearch({ ...search, categorySub: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all border-blue-200 bg-blue-50/30"
              >
                <option value="">
                  {t(translations.All, { name: t("ANTIBIOTICS") })}
                </option>
                {Object.values(CategorySub)
                  .filter((sub) => sub !== CategorySub.NONE)
                  .map((sub) => (
                    <option key={sub} value={sub}>
                      {t(sub)}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-all"
          >
            {t(translations.clear)}
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md"
          >
            <Search size={18} />
            {t(translations.apply)}
          </button>
        </div>
      </div>

      {/* Table Redesign */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                CLINICAL INFO
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                CLASSIFICATION
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                IDENTIFIERS
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                STATUS
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-slate-400  items-center justify-center gap-2"
                >
                  <Activity className="w-8 h-8 opacity-20" />
                  {t(translations.noData)}
                </td>
              </tr>
            ) : (
              (products as any[]).map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">#{product.stt}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">
                      {local === "en" ? product.nameEN : product.nameLA}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Stethoscope size={12} /> {product.genericName} •{" "}
                      {product.dosage}
                    </div>
                    {product.isPrescription === BooleanState.TRUE && (
                      <span className="mt-1 inline-block text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 font-bold">
                        RX REQUIRED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {t(product.category)}
                    </div>
                    <div className="text-xs text-blue-500">
                      {t(product.categorySub)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                      SKU: {product.sku}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      /{product.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive === BooleanState.TRUE ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {product.isActive}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        // onClick={() => handleActiveStatus(product)}
                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          page={page}
          setPage={setPage}
          loading={loading}
        />
      )}
      <ProductFormModal
        t={t}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={selectedProduct}
        allSymptoms={allSymptoms}
        isProcessing={isProcessing}
      />
    </div>
  );
}
