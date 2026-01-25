"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Stethoscope,
  Activity,
} from "lucide-react"; // ใช้ Icon ทางการแพทย์
import Pagination from "@/components/UI/Pagination";
import Swal from "sweetalert2";
import { useAlert } from "@/app/hooks/useAlert";
import { useAuth } from "@/app/hooks/useAuth";
import { usePagination } from "@/app/hooks/usePagination";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { Permission } from "@/generated/prisma/enums"; // อย่าลืมเพิ่ม Permission.SYMPTOM_MANAGE ใน Enum
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

export default function SymptomPage() {
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

  // State สำหรับการค้นหา
  const [search, setSearch] = useState({ name: "" });

  // Hook Pagination (ดึงข้อมูลจาก /api/symptoms)
  const {
    items: symptoms,
    pagination,
    loading,
    page,
    setPage,
    reloadData,
    applyFilters,
    clearFilters,
  } = usePagination("/api/symptoms");

  // ฟังก์ชัน Apply Search
  const handleApplyFilters = () => {
    applyFilters({ name: search.name });
  };

  // ฟังก์ชัน Clear Search
  const handleClearFilters = () => {
    setSearch({ name: "" });
    clearFilters();
  };

  // --- ฟอร์ม Create / Edit (SweetAlert) ---
  const showSymptomForm = async (symptom?: any) => {
    const { value: formData } = await Swal.fire({
      title: symptom
        ? `<div class="flex items-center gap-3 text-xl font-bold text-slate-800"><span class="bg-emerald-100 p-2 rounded-lg text-emerald-600">📝</span> ${t(translations.Edit, { name: t(translations.stt) })}</div>`
        : `<div class="flex items-center gap-3 text-xl font-bold text-slate-800"><span class="bg-emerald-100 p-2 rounded-lg text-emerald-600">➕</span> ${t(translations.Create, { name: t(translations.stt) })}</div>`, // ใช้ translations.stt หรือคำว่า Symptom ถ้ามี
      width: "600px",
      html: `
        <div class="text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
          <style>
             .field-label { font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; display: block; }
             .swal2-input-custom { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 0.9rem; transition: all 0.2s; background: white; }
             .swal2-input-custom:focus { border-color: #10b981; ring: 3px rgba(16, 185, 129, 0.1); outline: none; }
          </style>

          <div class="flex flex-col gap-4">
             <div>
               <label class="field-label">Symptom Name (English) <span class="text-red-500">*</span></label>
               <input id="swal-nameEN" value="${symptom?.nameEN || ""}" class="swal2-input-custom" placeholder="e.g. Headache, Fever">
             </div>

             <div>
               <label class="field-label">Symptom Name (Lao) <span class="text-red-500">*</span></label>
               <input id="swal-nameLA" value="${symptom?.nameLA || ""}" class="swal2-input-custom" placeholder="e.g. ປວດຫົວ, ເປັນໄຂ້">
             </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: symptom
        ? t(translations.update)
        : t(translations.create),
      cancelButtonText: t(translations.cancel),
      confirmButtonColor: "#10b981", // สีเขียว Emerald
      reverseButtons: false, // ปุ่มยืนยันอยู่ซ้าย (ตามที่คุณขอใน Product)
      preConfirm: () => {
        const getVal = (id: string) =>
          (document.getElementById(id) as HTMLInputElement)?.value;
        const nameEN = getVal("swal-nameEN");
        const nameLA = getVal("swal-nameLA");

        if (!nameEN || !nameLA) {
          Swal.showValidationMessage(t(translations.allFiledRequired)); // ใช้ key ที่แปลว่า "กรุณากรอกข้อมูลให้ครบ"
          return false;
        }

        return { nameEN, nameLA };
      },
    });

    if (formData) {
      showProcessing();
      try {
        const response = symptom
          ? await api.put(`/api/symptoms/${symptom.id}`, formData)
          : await api.post("/api/symptoms", formData);

        closeProcessing();
        if (response.data.success) {
          reloadData();
          showSuccess(t(response.data.message));
        } else {
          showError(t(response.data.message));
        }
      } catch (error: any) {
        closeProcessing();
        showError(t(error?.response?.data?.message || translations.unknown));
      }
    }
  };

  // --- ฟังก์ชัน Delete ---
  const handleDelete = async (symptom: any) => {
    const isConfirmed = await showConfirm(
      t(translations.confirmDelete, {
        name: local === "lo" ? symptom.nameLA : symptom.nameEN,
      }), // "คุณต้องการลบ...ใช่หรือไม่?"
    );

    if (isConfirmed) {
      showProcessing();
      try {
        const response = await api.delete(`/api/symptoms/${symptom.id}`);
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
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Stethoscope className="text-emerald-600 w-6 h-6" />
          </div>
          {/* Smart Search / Symptoms */}
          <span>{t(translations.Management, { name: t(translations.symptom) })} </span>
        </h1>

        {/* Permission Check: SYMPTOM_MANAGE or PRODUCT_CREATE */}
        {hasPermission(Permission.PRODUCT_CREATE) && (
          <button
            onClick={() => showSymptomForm()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            {t(translations.Create, { name: t(translations.symptom) })}
          </button>
        )}
      </div>

      {/* Filter Card */}
      <div className="mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.Filter, { name: t(translations.symptom) })}
            </label>
            <input
              type="text"
              placeholder={t(translations.SearchBy, {
                name: t(translations.name),
              })}
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider w-[80px] text-center">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  NAME (LAO)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  NAME (ENGLISH)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {symptoms.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400  items-center justify-center gap-2"
                  >
                    {t(translations.noData)}
                  </td>
                </tr>
              ) : (
                (symptoms as any[]).map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-slate-500 text-center font-mono">
                      {(page - 1) * 50 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                        {item.nameLA}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 font-medium">
                        {item.nameEN}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {hasPermission(Permission.PRODUCT_UPDATE) && (
                          <button
                            onClick={() => showSymptomForm(item)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition shadow-sm"
                            title={t(translations.edit)}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission(Permission.PRODUCT_DELETE) && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                            title={t(translations.delete)}
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
    </div>
  );
}
