"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  CheckCircle2,
  Save,
  Pill,
  AlertCircle,
  Search,
} from "lucide-react";
import { BooleanState, Category, CategorySub } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import ImageUpload from "./ImageUpload";
import { isEnglish } from "@/lib/utils/locale";

interface ProductFormProps {
  isOpen: boolean;
  t: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  allSymptoms: any[];
  local: string;
  onLoadMoreSymptoms: () => void;
  hasMoreSymptoms: boolean;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allSymptoms,
  t,
  local,
  onLoadMoreSymptoms,
  hasMoreSymptoms,
}: ProductFormProps) {
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreSymptoms) {
          onLoadMoreSymptoms();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMoreSymptoms, onLoadMoreSymptoms]);
  // --- STATE ---
  const [formData, setFormData] = useState<{
    nameEN: string;
    nameLA: string;
    genericName: string;
    sku: string;
    dosage: string;
    packaging: string;
    category: Category;
    categorySub: CategorySub;
    isPrescription: BooleanState;
    productImage: string;
    productImagePublicId: string;
    indicationEN: string;
    indicationLA: string;
    administrationEN: string;
    administrationLA: string;
    symptomIds: string[];
    slug: string;
  }>({
    nameEN: "",
    nameLA: "",
    genericName: "",
    sku: "",
    dosage: "",
    packaging: "",
    category: Category.OTHERS,
    categorySub: CategorySub.NONE,
    isPrescription: BooleanState.FALSE,
    productImage: "",
    productImagePublicId: "",

    indicationEN: "",
    indicationLA: "",
    administrationEN: "",
    administrationLA: "",
    symptomIds: [],
    slug: "",
  });
  const [symptomSearch, setSymptomSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- EFFECT: Load Data ---
  useEffect(() => {
    if (initialData) {
      setFormData({
        nameEN: initialData.nameEN || "",
        nameLA: initialData.nameLA || "",
        genericName: initialData.genericName || "",
        sku: initialData.sku || "",
        dosage: initialData.dosage || "",
        packaging: initialData.packaging || "",
        category: initialData.category || Category.OTHERS,
        categorySub: initialData.categorySub || CategorySub.NONE,
        isPrescription: initialData.isPrescription || BooleanState.FALSE,
        productImage: initialData.productImage || "",
        indicationEN: initialData.indicationEN || "",
        indicationLA: initialData.indicationLA || "",
        administrationEN: initialData.administrationEN || "",
        administrationLA: initialData.administrationLA || "",
        symptomIds: initialData.symptom?.map((s: any) => s.id) || [],
        slug: initialData.slug || "",
        productImagePublicId: initialData.productImagePublicId || "",
      });
    } else {
      // Reset
      setFormData({
        nameEN: "",
        nameLA: "",
        genericName: "",
        sku: "",
        dosage: "",
        packaging: "",
        category: Category.ANALGESIC_ANTIPYRETIC,
        categorySub: CategorySub.NONE,
        isPrescription: BooleanState.FALSE,
        productImage: "",
        indicationEN: "",
        indicationLA: "",
        administrationEN: "",
        administrationLA: "",
        symptomIds: [],
        slug: "",
        productImagePublicId: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // --- HANDLERS ---
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nameEN) newErrors.nameEN = "English name is required";
    if (!formData.nameLA) newErrors.nameLA = "Lao name is required";
    if (!formData.sku) newErrors.sku = "SKU is required";

    // Validate English Name
    if (/[^A-Za-z0-9\s.,\-()/]/.test(formData.nameEN)) {
      newErrors.nameEN = "English name contains invalid characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalSlug = formData.nameEN
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    onSubmit({ ...formData, slug: finalSlug });
  };

  const filteredSymptoms = allSymptoms.filter(
    (s) =>
      s.nameEN.toLowerCase().includes(symptomSearch.toLowerCase()) ||
      s.nameLA.toLowerCase().includes(symptomSearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-275 h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${initialData ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}
            >
              <Pill size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">
                {initialData
                  ? t(translations.Edit, { name: t(translations.product) })
                  : t(translations.Create, { name: t(translations.product) })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Clinical Information & Stock Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Image Upload using CldUploadWidget */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">
                  {t(translations.image)}
                </label>
                <ImageUpload
                  value={formData.productImage}
                  aspectRatio={1} // 16:9 for Banners
                  label="Click to Upload Product 1:1"
                  onChange={(result) =>
                    setFormData((prev) => ({
                      ...prev,
                      productImage: result.url,
                      productImagePublicId: result.publicId,
                    }))
                  }
                />
              </div>

              {/* Safety Control */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <label className="text-xs font-bold text-red-600 uppercase">
                    Safety Control
                  </label>
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 accent-red-600"
                    checked={formData.isPrescription === BooleanState.TRUE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPrescription: e.target.checked
                          ? BooleanState.TRUE
                          : BooleanState.FALSE,
                      })
                    }
                  />
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">
                      {t(translations.rxRequired)}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {t(translations.prescriptionRequired)}
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex-1 flex flex-col min-h-50">
                <div className="pb-2 border-b border-slate-100 mb-3 flex justify-between items-end">
                  <h3 className="text-sm font-bold text-slate-800">
                    {t(translations.Related, { name: t(translations.symptom) })}
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                    {formData.symptomIds.length} selected
                  </span>
                </div>
                <div className="relative mb-2">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-2.5 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder={t(translations.SearchBy, {
                      name: t(translations.symptom),
                    })}
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="flex-1 max-h-62.5 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  {filteredSymptoms.length > 0 ? (
                    <>
                      {filteredSymptoms.map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-purple-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 accent-purple-600 rounded"
                            checked={formData.symptomIds.includes(s.id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setFormData({
                                  ...formData,
                                  symptomIds: [...formData.symptomIds, s.id],
                                });
                              else
                                setFormData({
                                  ...formData,
                                  symptomIds: formData.symptomIds.filter(
                                    (id) => id !== s.id,
                                  ),
                                });
                            }}
                          />
                          <span className="text-xs text-slate-700 ">
                            {isEnglish(local) ? s.nameEN : s.nameLA}
                          </span>
                        </label>
                      ))}
                      <div
                        ref={observerTarget}
                        className="py-4 flex justify-center"
                      >
                        {hasMoreSymptoms ? (
                          <button
                            type="button"
                            onClick={onLoadMoreSymptoms}
                            className="text-[10px] text-indigo-600 font-bold hover:underline"
                          >
                            Show more
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            End of list
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400">
                      {t(translations.notFound)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (Main Form) */}
            <div className="flex flex-col gap-6">
              {/* 1. Identification */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                  {t(translations.identification)}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.sku)}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className={`w-full p-2 border rounded-lg text-sm font-mono ${errors.sku ? "border-red-500" : "border-slate-200"}`}
                      placeholder="CBF-001"
                    />
                    {errors.sku && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.sku}
                      </p>
                    )}
                  </div>
                  {/* <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.generic)}
                    </label>
                    <input
                      value={formData.genericName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          genericName: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="Active Ingredient"
                    />
                  </div> */}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.name, { Name: t(translations.product) })}{" "}
                      (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.nameEN}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEN: e.target.value })
                      }
                      className={`w-full p-2 border rounded-lg text-sm font-bold ${errors.nameEN ? "border-red-500" : "border-slate-200"}`}
                      placeholder="Product Name"
                    />
                    {errors.nameEN && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.nameEN}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.name, { name: t(translations.product) })}{" "}
                      (Lao) <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.nameLA}
                      onChange={(e) =>
                        setFormData({ ...formData, nameLA: e.target.value })
                      }
                      className={`w-full p-2 border rounded-lg text-sm font-bold ${errors.nameLA ? "border-red-500" : "border-slate-200"}`}
                      placeholder="ຊື່ຢາ"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Specs & Category */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                  {t(translations.specsCategory)}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.dosage)}
                    </label>
                    <input
                      value={formData.dosage}
                      onChange={(e) =>
                        setFormData({ ...formData, dosage: e.target.value })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="e.g. 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.packaging)}
                    </label>
                    <input
                      value={formData.packaging}
                      onChange={(e) =>
                        setFormData({ ...formData, packaging: e.target.value })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="e.g. 10x10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.category)}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Category,
                          categorySub: CategorySub.NONE,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                    >
                      {Object.values(Category).map((c) => (
                        <option key={c} value={c}>
                          {t(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.category === Category.ANTIBIOTICS && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-bold text-primary mb-1">
                        {t(Category.ANTIBIOTICS)}
                      </label>
                      <select
                        value={formData.categorySub}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categorySub: e.target.value as CategorySub,
                          })
                        }
                        className="w-full p-2 border border-primary/30 rounded-lg text-sm bg-primary/5 text-primary"
                      >
                        {Object.values(CategorySub).map((s) => (
                          <option key={s} value={s}>
                            {t(s)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Clinical Indications */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                  {t(translations.indication)}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.indication)} (English)
                    </label>
                    <textarea
                      value={formData.indicationEN}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          indicationEN: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[60px]"
                      placeholder="Description..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.indication)} (Lao)
                    </label>
                    <textarea
                      value={formData.indicationLA}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          indicationLA: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[60px]"
                      placeholder="ສັບພະຄຸນ..."
                    />
                  </div>
                </div>
              </div>

              {/* 4. Administration / Directions for Use */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                  {t(translations.administration)}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.administration)} (English)
                    </label>
                    <textarea
                      value={formData.administrationEN}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          administrationEN: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[60px]"
                      placeholder="Directions for use..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {t(translations.administration)} (Lao)
                    </label>
                    <textarea
                      value={formData.administrationLA}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          administrationLA: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[60px]"
                      placeholder="ວິທີໃຊ້..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
          >
            {t(translations.cancel)}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition shadow-lg shadow-primary/20 disabled:opacity-50 text-sm"
          >
            {initialData ? t(translations.update) : t(translations.create)}
          </button>
        </div>
      </div>
    </div>
  );
}
