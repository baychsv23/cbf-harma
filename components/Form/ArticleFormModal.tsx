"use client";
import { useState, useEffect, useMemo } from "react";
import {
  X,
  Image as ImageIcon,
  Search,
  Globe,
  ChevronRight,
  LayoutTemplate,
  Save,
  CheckCircle2,
} from "lucide-react";
import { ArticleType, ArticleStatus } from "@/generated/prisma/enums";
import TiptapEditor from "@/components/Editor/TiptapEditor";
import { translations } from "@/lib/translation";
import ImageUpload from "./ImageUpload";
import { isEnglish } from "@/lib/constant";

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  allProducts: any[];
  t: any
  local: string
}

export default function ArticleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allProducts,
  t,
  local
}: ArticleFormProps) {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"EN" | "LA">("LA");
  const [productSearch, setProductSearch] = useState("");

  const [formData, setFormData] = useState<{
    titleEN: string;
    titleLA: string;
    contentEN: string;
    contentLA: string;
    coverImage: string;
    coverImagePublicId: string,
    type: ArticleType;
    status: ArticleStatus;
    slug: string;
    productIds: string[];
  }>({
    titleEN: "",
    titleLA: "",
    contentEN: "",
    contentLA: "",
    coverImage: "",
    coverImagePublicId: "",
    type: ArticleType.HEALTH_KNOWLEDGE,
    status: ArticleStatus.DRAFT,
    slug: "",
    productIds: [],
  });

  // --- EFFECT ---
  useEffect(() => {
    if (initialData) {
      setFormData({
        titleEN: initialData.titleEN || "",
        titleLA: initialData.titleLA || "",
        contentEN: initialData.contentEN || "",
        contentLA: initialData.contentLA || "",
        coverImage: initialData.coverImage || "",
        type: initialData.type || ArticleType.HEALTH_KNOWLEDGE,
        status: initialData.status || ArticleStatus.DRAFT,
        slug: initialData.slug || "",
        productIds: initialData.products?.map((p: any) => p.id) || [],
        coverImagePublicId: initialData.coverImagePublicId || ""
      });
    } else {
      setFormData({
        titleEN: "",
        titleLA: "",
        contentEN: "",
        contentLA: "",
        coverImage: "",
        type: ArticleType.HEALTH_KNOWLEDGE,
        status: ArticleStatus.DRAFT,
        slug: "",
        productIds: [],
        coverImagePublicId: ""
      });
      setActiveTab("EN"); // Reset tab to EN for new article
    }
  }, [initialData, isOpen]);

  // --- HANDLERS ---
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.titleEN || !formData.titleLA) {
      return;
    }
    const finalSlug =
      formData.slug ||
      formData.titleEN
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    onSubmit({ ...formData, slug: finalSlug });
  };

  // Filter Products for Search
  const filteredProducts = allProducts.filter(
    (p) =>
      p.nameEN.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameLA.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-[1280px] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* === HEADER === */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${initialData ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}
            >
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">
                {initialData ? t(translations.Edit, { name: t(translations.article) }) : t(translations.Create, { name: t(translations.article) })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {initialData
                  ? "Update existing content details"
                  : "Add a new health knowledge article"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X
              size={20}
              className="text-slate-400 group-hover:text-slate-600"
            />
          </button>
        </div>

        {/* === BODY === */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50/50">
          {/* --- LEFT SIDEBAR (Meta Data) --- */}
          <div className="w-full lg:w-[320px] xl:w-[360px] border-r border-slate-200 bg-white overflow-y-auto p-5 flex flex-col gap-6 shrink-0 h-full">
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon size={12} /> Cover Image
              </label>
              <ImageUpload
                value={formData.coverImage}
                aspectRatio={1.78}     // 16:9 for Banners
                label="Click to Upload Article 16:9"
                onChange={(result) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: result.url,
                    coverImagePublicId: result.publicId,
                  }))
                }
              />

            </div>

            {/* Publishing Settings */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-100 mb-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Publishing Settings
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as ArticleType,
                      })
                    }
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  >
                    {Object.values(ArticleType).map((type) => (
                      <option key={type} value={type}>
                        {t(type)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    {t(translations.status)}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ArticleStatus,
                      })
                    }
                    className={`w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium ${formData.status === ArticleStatus.PUBLISHED
                      ? "bg-secondary/10 text-secondary border-secondary/30"
                      : "bg-slate-50 text-slate-600"
                      }`}


                  >
                    {Object.values(ArticleStatus).map((s) => (
                      <option key={s} value={s}>
                        {t(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Related Products */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="pb-2 border-b border-slate-100 mb-3 flex justify-between items-end">
                <h3 className="text-sm font-bold text-slate-800">
                  Related Products
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                  {formData.productIds.length} selected
                </span>
              </div>

              {/* Search Box */}
              <div className="relative mb-2">
                <Search
                  size={14}
                  className="absolute left-2.5 top-2.5 text-slate-400"
                />
                <input
                  type="text"
                  placeholder={t(translations.SearchBy, { name: t(translations.product) })}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Product List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const isSelected = formData.productIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer border transition-all ${isSelected
                          ? "bg-indigo-50 border-indigo-200"
                          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                          }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected
                            ? "bg-indigo-600 border-indigo-600"
                            : "bg-white border-slate-300"
                            }`}
                        >
                          {isSelected && (
                            <CheckCircle2 size={10} className="text-white" />
                          )}
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked)
                                setFormData({
                                  ...formData,
                                  productIds: [...formData.productIds, p.id],
                                });
                              else
                                setFormData({
                                  ...formData,
                                  productIds: formData.productIds.filter(
                                    (id) => id !== p.id,
                                  ),
                                });
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* กำหนดค่าสีไว้ที่ตัวแปรเดียว เพื่อลดความซ้ำซ้อน */}
                          {/* เพิ่มความแตกต่างของสีระหว่างชื่อหลักและชื่อรองให้ชัดเจนขึ้น (Opacity) */}
                          <div className={isSelected ? "text-indigo-700" : "text-slate-700"}>
                            <p className="text-sm font-medium truncate">
                              {isEnglish(local) ? p.nameEN : p.nameLA}
                            </p>
                            <p className={`text-xs truncate ${isSelected ? "text-indigo-500/80" : "text-slate-400"}`}>
                              {isEnglish(local) ? p.nameLA : p.nameEN}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400">
                    {t(translations.notFound)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Editor) --- */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Language Tabs */}
            <div className="flex items-center gap-1 px-6 pt-4 border-b border-slate-200 bg-white">
              <button
                onClick={() => setActiveTab("EN")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === "EN"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg"
                  }`}
              >
                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                  EN
                </span>{" "}
                English
              </button>
              <button
                onClick={() => setActiveTab("LA")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === "LA"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg"
                  }`}
              >
                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                  LA
                </span>{" "}
                Lao
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Title Input */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Article Title ({activeTab === "EN" ? "English" : "Lao"}){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={
                      activeTab === "EN" ? formData.titleEN : formData.titleLA
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [activeTab === "EN" ? "titleEN" : "titleLA"]:
                          e.target.value,
                      }))
                    }
                    className="w-full text-2xl font-bold placeholder:text-slate-300 border-none focus:ring-0 p-0 text-slate-800"
                    placeholder={
                      activeTab === "EN"
                        ? "Enter article headline..."
                        : "ໃສ່ຫົວຂໍ້ບົດຄວາມ..."
                    }
                  />
                </div>

                {/* Tiptap Editor */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Content Body
                    </span>
                    <Globe size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1 p-2">
                    <TiptapEditor
                      content={
                        activeTab === "EN"
                          ? formData.contentEN
                          : formData.contentLA
                      }
                      onChange={(html) =>
                        setFormData((prev) => ({
                          ...prev,
                          [activeTab === "EN" ? "contentEN" : "contentLA"]:
                            html,
                        }))
                      }
                      placeholder={
                        activeTab === "EN"
                          ? "Start writing your story..."
                          : "ເລີ່ມຂຽນເນື້ອຫາ..."
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-between items-center z-10">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            {initialData ? "Editing mode" : "Draft mode"}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 border border-transparent transition-all text-sm"
            >
              {t(translations.cancel)}
            </button>
            <button
              onClick={handleSubmit}

              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
            >

              <Save size={18} />
              {initialData ? t(translations.update) : t(translations.create)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
