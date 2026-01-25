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
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

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

  useEffect(() => {
    const fetchSymptoms = async () => {
      const { data } = await api.get("/api/symptoms"); // ต้องมี API นี้
      setAllSymptoms(data.data || []);
    };
    fetchSymptoms();
  }, []);

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
  console.log(products);
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
  const getCatLabel = (cat: string) => cat.replace(/_/g, " ");

  const showProductForm = async (product?: any) => {
    const productSymptomIds = product?.symptom?.map((s: any) => s.id) || [];
    const symptomsHtml = allSymptoms
      .map((symptom) => {
        const isChecked = productSymptomIds.includes(symptom.id)
          ? "checked"
          : "";
        return `
      <label class="flex items-center gap-2 p-2 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors bg-white">
        <input type="checkbox" name="symptom_ids" value="${symptom.id}" ${isChecked} class="w-4 h-4 accent-blue-600 rounded">
        <span class="text-sm text-slate-700 font-medium">${symptom.nameLa} / ${symptom.nameEn}</span>
      </label>
    `;
      })
      .join("");
    const { value: formData } = await Swal.fire({
      title: product
        ? `<div class="flex items-center gap-3 text-xl font-bold text-slate-800"><span class="bg-blue-100 p-2 rounded-lg text-blue-600">💊</span> ${t(translations.Edit, { name: t(translations.product) })}</div>`
        : `<div class="flex items-center gap-3 text-xl font-bold text-slate-800"><span class="bg-green-100 p-2 rounded-lg text-green-600">➕</span> ${t(translations.Create, { name: t(translations.product) })}</div>`,
      width: "1000px", // เพิ่มความกว้างเพื่อให้วาง 2 คอลัมน์ได้ไม่อึดอัด
      padding: "0", // ลบ padding เดิมออก เพื่อจัด layout เอง
      background: "#f8fafc", // สีพื้นหลังเทาอ่อน
      html: `
      <div class="text-left bg-slate-50">
        <style>
          /* Layout */
          .form-container { padding: 1.5rem 2rem; display: grid; grid-template-columns: 300px 1fr; gap: 2rem; max-height: 75vh; overflow-y: auto; }
          .left-panel { display: flex; flex-direction: column; gap: 1.5rem; }
          .right-panel { display: flex; flex-direction: column; gap: 1.5rem; }
          
          /* Cards */
          .form-card { background: white; border-radius: 1rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          .form-card-title { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem; }
          
          /* Inputs */
          .field-group { margin-bottom: 1rem; }
          .field-label { display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 0.35rem; }
          .swal2-input-custom { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 0.6rem; font-size: 0.875rem; transition: all 0.2s; background: #fff; color: #1e293b; }
          .swal2-input-custom:focus { border-color: #3b82f6; ring: 3px rgba(59, 130, 246, 0.1); outline: none; }
          textarea.swal2-input-custom { min-height: 80px; resize: vertical; }

          /* Image Upload */
          .image-preview-box { width: 100%; aspect-ratio: 1/1; border: 2px dashed #cbd5e1; border-radius: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; cursor: pointer; transition: all 0.2s; position: relative; }
          .image-preview-box:hover { border-color: #3b82f6; background: #eff6ff; }
          .image-preview-box img { width: 100%; height: 100%; object-fit: cover; }
          .upload-hint { font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; text-align: center; }

          /* Animation */
          .slide-reveal { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; max-height: 100px; opacity: 1; }
          .slide-reveal.hidden { max-height: 0; opacity: 0; margin: 0; }
        </style>

        <div class="form-container">
          <div class="left-panel">
            <div class="form-card">
              <div class="form-card-title">📸 Product Visual</div>
              <div id="image-upload-trigger" class="image-preview-box">
                 <img id="swal-img-preview" src="${product?.productImageUrl || "https://placehold.co/400x400/f1f5f9/94a3b8?text=Upload+Image"}" alt="preview">
                 <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-sm">Change Image</div>
              </div>
              <p class="upload-hint">Click to upload (JPG, PNG)</p>
              <input type="hidden" id="swal-productImageUrl" value="${product?.productImageUrl || ""}">
            </div>

            <div class="form-card border-l-4 border-l-red-500">
               <div class="form-card-title text-red-600">⚠️ Safety Control</div>
               <label class="flex items-start gap-3 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors">
                 <input type="checkbox" id="swal-isPrescription" class="mt-1 w-5 h-5 accent-red-600" ${product?.isPrescription === BooleanState.TRUE ? "checked" : ""}>
                 <div>
                   <span class="block font-bold text-slate-800 text-sm">Prescription Required</span>
                   <span class="text-xs text-slate-500 leading-snug">Check this if the medicine requires a doctor's Rx.</span>
                 </div>
               </label>
            </div>
          </div>

          <div class="right-panel">
            
            <div class="form-card">
              <div class="form-card-title">📝 Identification</div>
              <div class="grid grid-cols-2 gap-4">
                 <div class="field-group">
                   <label class="field-label">SKU / Code</label>
                   <input id="swal-sku" value="${product?.sku || ""}" class="swal2-input-custom font-mono" placeholder="CBF-001">
                 </div>
                 <div class="field-group">
                   <label class="field-label">Generic Name</label>
                   <input id="swal-genericName" value="${product?.genericName || ""}" class="swal2-input-custom" placeholder="Active Ingredient">
                 </div>
                 <div class="field-group col-span-2">
                   <label class="field-label">Product Name (English) <span class="text-red-500">*</span></label>
                   <input id="swal-nameEN" value="${product?.nameEN || ""}" class="swal2-input-custom font-medium" placeholder="e.g. Amoxicillin 500mg">
                 </div>
                 <div class="field-group col-span-2">
                   <label class="field-label">Product Name (Lao) <span class="text-red-500">*</span></label>
                   <input id="swal-nameLA" value="${product?.nameLA || ""}" class="swal2-input-custom font-medium" placeholder="ຊື່ຢາພາສາລາວ">
                 </div>
              </div>
            </div>

            <div class="form-card">
              <div class="form-card-title">🧪 Specifications & Category</div>
              <div class="grid grid-cols-2 gap-4">
                 <div class="field-group">
                   <label class="field-label">Dosage Strength</label>
                   <input id="swal-dosage" value="${product?.dosage || ""}" class="swal2-input-custom" placeholder="e.g. 500mg">
                 </div>
                 <div class="field-group">
                   <label class="field-label">Packaging</label>
                   <input id="swal-packaging" value="${product?.packaging || ""}" class="swal2-input-custom" placeholder="e.g. 10x10 Box">
                 </div>
                 
                 <div class="field-group">
                   <label class="field-label">Category</label>
                   <select id="swal-category" class="swal2-input-custom bg-slate-50">
                     ${Object.values(Category)
                       .map(
                         (c) =>
                           `<option value="${c}" ${product?.category === c ? "selected" : ""}>${getCatLabel(c)}</option>`,
                       )
                       .join("")}
                   </select>
                 </div>

                 <div id="sub-category-wrapper" class="field-group slide-reveal hidden">
                   <label class="field-label text-blue-600 font-bold">Antibiotic Class</label>
                   <select id="swal-categorySub" class="swal2-input-custom border-blue-200 bg-blue-50 text-blue-700">
                     ${Object.values(CategorySub)
                       .map(
                         (s) =>
                           `<option value="${s}" ${product?.categorySub === s ? "selected" : ""}>${getCatLabel(s)}</option>`,
                       )
                       .join("")}
                   </select>
                 </div>
              </div>
            </div>

            <div class="form-card">
              <div class="form-card-title">🩺 Clinical Indications</div>
              <div class="grid grid-cols-1 gap-4">
                 <div class="field-group">
                   <label class="field-label">Indication (English)</label>
                   <textarea id="swal-indicationEN" class="swal2-input-custom" placeholder="Treatment description...">${product?.indicationEN || ""}</textarea>
                 </div>
                 <div class="field-group">
                   <label class="field-label">Indication (Lao)</label>
                   <textarea id="swal-indicationLA" class="swal2-input-custom" placeholder="ສັບພະຄຸນ...">${product?.indicationLA || ""}</textarea>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: product
        ? t(translations.update)
        : t(translations.create),
      cancelButtonText: t(translations.cancel),
      didOpen: () => {
        // 1. ดึง Elements มาเตรียมไว้

        const uploadTrigger = document.getElementById("image-upload-trigger");
        const imgPreview = document.getElementById(
          "swal-img-preview",
        ) as HTMLImageElement;
        const imgInput = document.getElementById(
          "swal-productImageUrl",
        ) as HTMLInputElement;

        uploadTrigger?.addEventListener("click", () => {
          // @ts-ignore
          const myWidget = window.cloudinary.createUploadWidget(
            {
              cloudName: "YOUR_CLOUD_NAME", // แก้เป็นของคุณ
              uploadPreset: "YOUR_PRESET", // แก้เป็นของคุณ
              sources: ["local", "url", "camera"],
              multiple: false,
              cropping: true,
            },
            (error: any, result: any) => {
              if (!error && result && result.event === "success") {
                const uploadedUrl = result.info.secure_url;
                imgPreview.src = uploadedUrl;
                imgInput.value = uploadedUrl;
              }
            },
          );
          myWidget.open();
        });
        const categorySelect = document.getElementById(
          "swal-category",
        ) as HTMLSelectElement;
        const subWrapper = document.getElementById("sub-category-wrapper");
        const subSelect = document.getElementById(
          "swal-categorySub",
        ) as HTMLSelectElement;

        // 2. สร้างฟังก์ชัน Logic การแสดงผล
        const updateVisibility = () => {
          const val = categorySelect.value;
          // ใช้ string 'ANTIBIOTICS' ตรงๆ เพื่อความชัวร์ (หรือใช้ Category.ANTIBIOTICS ถ้า import มาถูก)
          if (val === Category.ANTIBIOTICS) {
            subWrapper?.classList.remove("hidden");
          } else {
            subWrapper?.classList.add("hidden");
            // รีเซ็ตค่าเป็น NONE เมื่อซ่อน เพื่อไม่ให้ส่งข้อมูลขยะไป
            subSelect.value = "NONE";
          }
        };

        // 3. ผูก Event Listener
        categorySelect.addEventListener("change", updateVisibility);

        // 4. ***สำคัญ*** เรียกใช้ฟังก์ชันทันที 1 ครั้ง เพื่อเช็คค่าเริ่มต้น (Initial State)
        // แก้ปัญหา popup เด้งมาแล้ว dropdown แสดง/ซ่อน ผิดจังหวะ
        updateVisibility();
      },
      preConfirm: () => {
        const getVal = (id: string) =>
          (document.getElementById(id) as HTMLInputElement)?.value;
        const nameEN = getVal("swal-nameEN");
        const nameLA = getVal("swal-nameLA");
        const genericName = getVal("swal-genericName");
        const sku = getVal("swal-sku");
        const dosage = getVal("swal-dosage");
        const packaging = getVal("swal-packaging");
        const category = getVal("swal-category");
        const categorySub = getVal("swal-categorySub");
        const indicationLA = getVal("swal-indicationLA");
        const indicationEN = getVal("swal-indicationEN");
        if (!sku) {
          Swal.showValidationMessage(
            t(translations.FiledRequired, { name: t(translations.sku) }),
          );
        }
        if (!nameEN || !nameLA) {
          Swal.showValidationMessage(
            t(translations.FiledRequired, { name: t(translations.name) }),
          );
          return false;
        }
        const slug = nameEN
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const isPrescription = (
          document.getElementById("swal-isPrescription") as HTMLInputElement
        ).checked
          ? BooleanState.TRUE
          : BooleanState.FALSE;

        return {
          nameEN,
          nameLA,
          genericName,
          sku,
          dosage,
          packaging,
          category,
          categorySub,
          isPrescription,
          slug,
          indicationLA,
          indicationEN,
        };
      },
    });

    if (formData) {
      showProcessing();
      // Logic Save/Update
      if (product) {
        // กรณีแก้ไข (Update) -> ยิง PUT ไปที่ /api/products/[id]
        await api.put(`/api/products/${product.id}`, formData);
      } else {
        // กรณีสร้างใหม่ (Create) -> ยิง POST ไปที่ /api/products
        await api.post("/api/products", formData);
      }
      reloadData();
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      {/* Header section identical to yours but with updated Permission enum */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Pill className="text-blue-600" /> {t(translations.product)}
        </h1>
        {hasPermission(Permission.PRODUCT_CREATE) && (
          <button
            onClick={() => showProductForm()}
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
              <th className="px-6 py-4 text-xs font-bold text-slate-500">
                STT
              </th>
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
            {products.map((product: any) => (
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
                    {getCatLabel(product.category)}
                  </div>
                  <div className="text-xs text-blue-500">
                    {getCatLabel(product.categorySub)}
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
                      onClick={() => showProductForm(product)}
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
            ))}
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
    </div>
  );
}
