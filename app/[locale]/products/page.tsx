"use client";
import { useEffect, useState } from "react";
import { Search, RefreshCcw, Plus, Edit, Settings2 } from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import Swal from "sweetalert2";
import { useAlert } from "@/app/hooks/useAlert";
import { useAuth } from "@/app/hooks/useAuth";
import { usePagination } from "@/app/hooks/usePagination";
import Loader from "@/components/Loader";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { ActiveState, Permission } from "@/app/generated/prisma/enums";

import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import {
  createProduct,
  updateActiveProduct,
  updateProduct,
} from "@/actions/products";

export default function ProductPage() {
  const t = useTranslations();
  const local = useLocale();
  const {
    showSuccess,
    showError,
    showConfirm,
    showProcessing,
    closeProcessing,
  } = useAlert();
  const [search, setSearch] = useState({ name: "" });
  const api = useApiWithAlert();
  const [unitPacks, setUnitPacks] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
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

  const { hasPermission } = useAuth();

  const handleApplyFilters = () => {
    applyFilters({
      name: search.name,
    });
  };

  const handleClearFilters = () => {
    setSearch({ name: "" });
    clearFilters();
  };

  useEffect(() => {
    const loadUnitPacks = async () => {
      // Load unit products for the dropdown
      const { data } = await api.get("/api/unit-packs");
      setUnitPacks(data.data || []);
    };
    const loadBrands = async () => {
      // Load brands for the dropdown
      const { data } = await api.get("/api/brands");
      setBrands(data.data || []);
    };
    loadBrands();
    loadUnitPacks();
  }, []);

  const showProductForm = async (product?: any) => {
    // 1. Helpers สำหรับสร้าง Dropdown Options
    const getOptions = (
      data: any[],
      selectedId: string,
      labelKey: (item: any) => string,
    ) => {
      return data
        .map(
          (item) => `
      <option value="${item.id}" ${selectedId === item.id ? "selected" : ""}>
        ${labelKey(item)}
      </option>
    `,
        )
        .join("");
    };

    const unitPackOptions = getOptions(unitPacks, product?.unitId, (up) =>
      local === "th" ? up.nameTH : up.nameLA,
    );

    const brandOptions = getOptions(brands, product?.brandId, (b) => b.name);

    // 2. เรียกใช้ SweetAlert
    const { value: formData } = await Swal.fire({
      title: product
        ? t(translations.Edit, { name: t(translations.product) })
        : t(translations.Create, { name: t(translations.product) }),
      width: "650px",
      html: `
      <div class="p-2 text-left">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.name)} (${t(translations.thai)})</label>
            <input id="swal-nameTH" value="${product?.nameTH || ""}" class="swal2-input-custom" placeholder="${t(translations.name)}">
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.name)} (${t(translations.lao)})</label>
            <input id="swal-nameLA" value="${product?.nameLA || ""}" class="swal2-input-custom" placeholder="${t(translations.name)}">
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.barcode)}</label>
            <input id="swal-barcode" value="${product?.barcode || ""}" class="swal2-input-custom" placeholder="EAN-13, UPC...">
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.brand)}</label>
            <select id="swal-brandId" class="swal2-select-custom">
              <option value="">-- ${t(translations.Select, { name: t(translations.brand) })} --</option>
              ${brandOptions}
            </select>
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.unitPack)}</label>
            <select id="swal-unitPackId" class="swal2-select-custom">
              <option value="">-- ${t(translations.Select, { name: t(translations.unitPack) })} --</option>
              ${unitPackOptions}
            </select>
          </div>
          <div class="col-span-2 md:col-span-1">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.unitsPerBox)}</label>
            <input type="number" id="swal-unitsPerBox" value="${product?.unitsPerBox || "1"}" min="1" class="swal2-input-custom">
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">${t(translations.descriptions)}</label>
            <textarea id="swal-descriptions" class="swal2-textarea-custom" rows="2">${product?.descriptions || ""}</textarea>
          </div>
        </div>
      </div>

      <style>
        .swal2-input-custom, .swal2-select-custom, .swal2-textarea-custom {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 4px;
          box-sizing: border-box;
        }
        .swal2-input-custom:focus, .swal2-select-custom:focus {
          border-color: #3b82f6;
          outline: none;
          ring: 2px #3b82f6;
        }
      </style>
    `,
      focusConfirm: false,
      confirmButtonText: t(translations.submit),
      showCancelButton: true,
      cancelButtonText: t(translations.cancel),
      preConfirm: () => {
        // Helper ดึงค่าและจัดการ Validation
        const getValue = (id: string) =>
          (document.getElementById(id) as any)?.value?.trim();

        const data = {
          nameTH: getValue("swal-nameTH"),
          nameLA: getValue("swal-nameLA"),
          barcode: getValue("swal-barcode"),

          brandId: getValue("swal-brandId"),
          unitId: getValue("swal-unitPackId"),
          unitsPerBox: Number(getValue("swal-unitsPerBox")),
          descriptions: getValue("swal-descriptions"),
        };

        // Validation logic
        if (!data.nameTH || !data.nameLA)
          return Swal.showValidationMessage(
            t(translations.FieldRequired, { name: t(translations.name) }),
          );
        if (!data.barcode)
          return Swal.showValidationMessage(
            t(translations.FieldRequired, { name: t(translations.barcode) }),
          );
        if (!data.brandId)
          return Swal.showValidationMessage(
            t(translations.FieldRequired, { name: t(translations.brand) }),
          );
        if (!data.unitId)
          return Swal.showValidationMessage(
            t(translations.FieldRequired, { name: t(translations.unitPack) }),
          );
        if (isNaN(data.unitsPerBox) || data.unitsPerBox <= 0)
          return Swal.showValidationMessage(
            t(translations.FieldRequired, { name: t(translations.pack) }),
          );

        return data;
      },
    });

    if (formData) {
      let result;
      showProcessing();
      if (product) {
        result = await updateProduct(product.id, formData);
      } else {
        result = await createProduct(formData);
      }

      closeProcessing();
      if (result.success) {
        showSuccess(t(result.message));
        reloadData();
      } else {
        showError(t(result.message));
      }
    }
  };

  const handleActiveStatus = async (product: any) => {
    const nextStatus =
      product.activeStatus === ActiveState.ACTIVE
        ? ActiveState.INACTIVE
        : ActiveState.ACTIVE;

    const text = t(translations.MessageManageActive, {
      status: t(nextStatus),
      name: product.name,
    });

    const confirm = await showConfirm(text);
    if (confirm) {
      let result;
      showProcessing();
      result = await updateActiveProduct(product.id, nextStatus);

      closeProcessing();
      if (result.success) {
        showSuccess(t(result.message));
        reloadData();
      } else {
        showError(t(result.message));
      }
    }
  };

  return (
    <div className="p-8 max-w-400 mx-auto min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t(translations.product)}
        </h1>
        {hasPermission(Permission.PRODUCT_CREATE) && (
          <button
            onClick={() => showProductForm()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            {t(translations.Create, { name: t(translations.product) })}
          </button>
        )}
      </div>

      {/* Filter Card */}
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t(translations.Filter, { name: t(translations.product) })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t(translations.SearchBy, {
              name: t(translations.Name, { name: t(translations.product) }),
            })}
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
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
                  {t(translations.name)} & {t(translations.brand)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.barcode)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.unitPack)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.status)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    {t(translations.noData)}
                  </td>
                </tr>
              ) : (
                (
                  products as Array<{
                    id: string;
                    stt: number;
                    nameTH: string;
                    nameLA: string;
                    activeStatus: ActiveState;
                    unit: { nameTH?: string; nameLA?: string };
                    unitsPerBox?: number;
                    brand?: { name: string };
                    barcode: string;
                    descriptions?: string;
                  }>
                ).map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {product.stt}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {`${
                        local === "th" ? product.nameTH : product.nameLA
                      } (${product.brand?.name})`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {product.barcode || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {`1/${product.unitsPerBox}
                      ${
                        local === "th"
                          ? product.unit?.nameTH
                          : product.unit?.nameLA
                      }
                      ${product.descriptions}`}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      <span
                        className={`font-medium ${
                          product.activeStatus === ActiveState.ACTIVE
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t(product.activeStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {hasPermission(Permission.PRODUCT_UPDATE) && (
                          <button
                            onClick={() => showProductForm(product)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition"
                          >
                            <Edit size={14} />
                            {t(translations.edit)}
                          </button>
                        )}
                        {hasPermission(Permission.PRODUCT_DELETE) && (
                          <button
                            onClick={() => handleActiveStatus(product)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                          >
                            <Settings2 size={14} />
                            {t(translations.manage)}
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
