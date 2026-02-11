"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Shield,
  KeyRound,
  Power,
  User,
  Mail,
  UserCog,
  RefreshCcw
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
import { FilterActions } from "@/components/UI/FilterActions";

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
    applyFilters({ userName: search.userName });
  };

  const handleClearFilters = () => {
    setSearch({ userName: "" });
    clearFilters();
  };

  const handleActiveStatus = async (acc: any) => {
    const nextStatus =
      acc.isActive === BooleanState.TRUE
        ? BooleanState.FALSE
        : BooleanState.TRUE; // Fixed logic to toggle correctly

    const text = t(translations.MessageManageIsActive, {
      status: t(nextStatus === BooleanState.FALSE ? translations.inactive : translations.active),
      name: acc.userName,
    });

    const confirm = await showConfirm(text);

    if (confirm) {
      showProcessing();
      const result = await activeAccount(acc.id, nextStatus);
      closeProcessing();

      if (result.success) {
        showSuccess((result.message));
        reloadData();
      } else {
        showError((result.message));
      }
    }
  };

  const showResetPasswordForm = async (user?: any) => {
    const { value: formData } = await Swal.fire({
      title: `<div class="flex items-center gap-2 justify-center text-slate-800"><span class="bg-orange-100 p-2 rounded-lg text-orange-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg></span> ${t(translations.resetPassword)}</div>`,
      html: `
        <div class="text-left mt-4">
           <div class="mb-4">
             <label class="block text-xs font-bold text-slate-500 uppercase mb-1">${t(translations.userName)}</label>
             <input disabled value="${user.userName || ""}" class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm font-mono cursor-not-allowed">
           </div>
           <div>
             <label class="block text-xs font-bold text-slate-500 uppercase mb-1">${t(translations.newPassword)}</label>
             <input type="password" id="swal-new-password" class="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Enter new password...">
           </div>
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: t(translations.submit),
      showCancelButton: true,
      cancelButtonText: t(translations.cancel),
      confirmButtonColor: "#d4af37", // Accent for warning action
      width: "500px",
      preConfirm: () => {
        const newPassword = (document.getElementById("swal-new-password") as HTMLInputElement)?.value?.trim();
        if (!newPassword) {
          Swal.showValidationMessage(t(translations.FiledRequired, { name: t(translations.newPassword) }));
          return false;
        }
        return { newPassword };
      },
    });

    if (formData) {
      showProcessing();
      const result = await resetPassword(user.id, formData.newPassword);
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
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="bg-sky-100 p-2 rounded-xl">
            <UserCog className="text-sky-600 w-6 h-6" />
          </div>
          <span>{t(translations.Management, { name: t(translations.account) })} </span>
        </h1>

        {hasPermission(Permission.USER_CREATE) && (
          <Link
            href={"/accounts/create"}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            {t(translations.Create, { name: t(translations.account) })}
          </Link>
        )}
      </div>

      {/* Filter Card */}
      <div className="mb-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">
              {t(translations.Filter, { name: t(translations.userName) })}
            </label>
            <input
              type="text"
              placeholder={t(translations.SearchBy, { name: t(translations.userName) })}
              value={search.userName}
              onChange={(e) => setSearch({ ...search, userName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <FilterActions
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">{t(translations.stt)}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">{t(translations.Info, { name: t(translations.account) })}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">{t(translations.role)}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">{t(translations.status)}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">{t(translations.actions)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                    <User className="w-8 h-8 opacity-20" />
                    {t(translations.noData)}
                  </td>
                </tr>
              ) : (
                (users as any[]).map((user) => (
                  <tr key={user.id} className="hover:bg-sky-50/30 transition-colors group">
                    <td className="px-6 py-4">{user.stt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar Circle */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold shrink-0">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                            <Mail size={10} /> {user.userName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 w-fit ${user.role === Role.ADMIN
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {user.role === Role.ADMIN && <Shield size={10} />}
                        {t(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${user.isActive === BooleanState.TRUE
                        ? 'bg-secondary-100 text-secondary-700 border-secondary-300'
                        : 'bg-red-100/50 text-red-600/70 border-red-200/50'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.isActive === BooleanState.TRUE ? 'bg-secondary-500' : 'bg-red-300'}`}></div>
                        {t(user.isActive === BooleanState.TRUE ? translations.active : translations.inactive)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {hasPermission(Permission.USER_UPDATE) && (
                          <Link
                            href={`/accounts/${user.id}/edit`}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition shadow-sm"
                            title={t(translations.edit)}
                          >
                            <Edit size={16} />
                          </Link>
                        )}

                        {hasPermission(Permission.USER_UPDATE) && (
                          <button
                            onClick={() => showResetPasswordForm(user)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200 transition shadow-sm"
                            title={t(translations.resetPassword)}
                          >
                            <KeyRound size={16} />
                          </button>
                        )}

                        {hasPermission(Permission.USER_DELETE) && (
                          <button
                            onClick={() => handleActiveStatus(user)}
                            className={`p-2 bg-white border border-slate-200 rounded-lg transition shadow-sm ${user.isActive === BooleanState.TRUE
                              ? "text-slate-600 hover:bg-red-100 hover:text-red-600 hover:border-red-200"
                              : "text-slate-400 hover:bg-red-100/50 hover:text-red-600/70 hover:border-red-200/50"
                              }`}
                            title={t(translations.manage)}
                          >
                            <Power size={16} />
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
      <div className="mt-10 flex justify-center">
        {!loading && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            page={page}
            setPage={setPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}