"use client";

import { useState } from "react";
import {
  Search,
  RefreshCcw,
  Plus,
  Edit,
  Trash,
  UserRoundCog,
} from "lucide-react";
import Pagination from "@/components/UI/Pagination";
import { usePagination } from "@/app/hooks/usePagination";

import Swal from "sweetalert2";

import { useAuth } from "@/app/hooks/useAuth";
import { useAlert } from "@/app/hooks/useAlert";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";
import { BooleanState, Permission, Role } from "@/generated/prisma/enums";
import { activeAccount } from "@/action/accounts";
import { resetPassword } from "@/action/resetPassword";

export default function AccountsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState({ userName: "" });
  const {
    showProcessing,
    closeProcessing,
    showError,
    showSuccess,
    showConfirm,
  } = useAlert();
  const { hasPermission } = useAuth();
  const {
    items: users,
    pagination,
    loading,
    page,
    setPage,
    reloadData,
    applyFilters,
    clearFilters,
  } = usePagination("/api/accounts");

  const handleApplyFilters = () => {
    applyFilters({
      userName: search.userName,
    });
  };

  const handleClearFilters = () => {
    setSearch({ userName: "" });
    clearFilters();
  };
  const handleActiveStatus = async (acc: any) => {
    // หา status ที่จะเปลี่ยนเป็น
    const nextStatus =
      acc.activeStatus === BooleanState.TRUE
        ? BooleanState.FALSE
        : BooleanState.FALSE;

    // หา label แปลภาษาที่จะแสดง
    const text = t(translations.MessageManageIsActive, {
      status: t(nextStatus),
      name: acc.userName,
    });

    const confirm = await showConfirm(text);

    if (confirm) {
      let result;
      showProcessing();

      result = await activeAccount(acc.id, nextStatus);

      if (result.success) {
        showSuccess(t(result.message));
        reloadData();
      } else {
        showError(t(result.message));
      }
      closeProcessing();
    }
  };

  const showResetPasswordForm = async (user?: any) => {
    // Get existing warehouse IDs for the product

    const { value: formData } = await Swal.fire({
      title: t(translations.resetPassword),
      html: `
        <div style="text-align: left;">
           <label style="display: block; margin-bottom: 8px; font-weight: 500;">${t(
        translations.userName,
      )}</label>
          <input 
            id="swal-userName" 
            class="swal2-input" 
            value="${user.userName || ""}"
            disabled
            style="margin-bottom: 15px; background-color: #f5f5f5; color: #888; cursor: not-allowed;"
          >
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">${t(
        translations.newPassword,
      )}</label>
          <input 
            id="swal-new-password" 
            class="swal2-input" 
            placeholder=${t(translations.Placeholder, { name: t(translations.newPassword) })}
            value=""
            style="margin-bottom: 15px;"
          >
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: t(translations.submit),
      showCancelButton: true,
      cancelButtonText: t(translations.cancel),
      width: "600px",
      preConfirm: () => {
        const newPassword = (
          document.getElementById("swal-new-password") as HTMLInputElement
        )?.value?.trim();
        if (!newPassword) {
          Swal.showValidationMessage(
            t(translations.FiledRequired, {
              name: t(translations.newPassword),
            }),
          );
          return false;
        }
        return {
          newPassword,
        };
      },
    });

    if (formData) {
      let result;
      showProcessing();

      result = await resetPassword(user.id, formData.newPassword);

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
          {t(translations.account)}
        </h1>
        <Link
          href={"/accounts/create"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
          {t(translations.Create, { name: t(translations.account) })}
        </Link>
      </div>

      {/* Filter Card */}
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t(translations.Filter, { name: t(translations.account) })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t(translations.SearchBy, {
              name: t(translations.userName),
            })}
            value={search.userName}
            onChange={(e) => setSearch({ ...search, userName: e.target.value })}
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
                  {t(translations.userName)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.fullName)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.status)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  {t(translations.role)}
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    {t(translations.noData)}
                  </td>
                </tr>
              ) : (
                (
                  users as Array<{
                    id: string;
                    userName: string;
                    stt: number;
                    fullName: string;
                    isActive: BooleanState;
                    role: Role;
                  }>
                ).map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.stt}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-medium ${user.isActive === BooleanState.TRUE
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {t(user.isActive === BooleanState.TRUE ? translations.active : translations.inactive)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {t(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {hasPermission(Permission.USER_UPDATE) && (
                          <>
                            <Link
                              href={`/accounts/${user.id}/edit`}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition"
                            >
                              <Edit size={14} />
                              {t(translations.edit)}
                            </Link>
                            <button
                              onClick={() => showResetPasswordForm(user)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                            >
                              <UserRoundCog size={14} />
                              {t(translations.resetPassword)}
                            </button>
                          </>
                        )}
                        {hasPermission(Permission.USER_DELETE) && (
                          <button
                            onClick={() => handleActiveStatus(user)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition"
                          >
                            <UserRoundCog size={14} />
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
