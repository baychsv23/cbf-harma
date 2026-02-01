"use client";

import React, { use, useActionState, useEffect, useState } from "react";
import { initialState, modules } from "@/lib/constant";
import { useTranslations } from "next-intl";

import { useAlert } from "@/app/hooks/useAlert";
import { updateAccount } from "@/action/accounts";
import { useRouter } from "@/i18n/routing";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { Permission, Role } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";

export default function EditAccountPage({ params }: any) {
  const unwrappedParams = use(params);
  const { id }: any = unwrappedParams;
  const router = useRouter();
  const t = useTranslations();
  const api = useApiWithAlert();
  const [state, formAction] = useActionState(updateAccount, initialState);
  const { showError, showSuccess, showProcessing, closeProcessing } =
    useAlert();

  const [formUser, setFormUser] = useState({
    userName: "",
    role: "",
    expiryAt: "",
    fullName: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

  useEffect(() => {
    const fetchAccount = async () => {
      if (!id) return; // Guard clause

      try {
        showProcessing();
        const { data: account } = await api.get(`/api/accounts/${id}`);
        closeProcessing();
        const accountRes = account.data;

        setFormUser({
          userName: accountRes.userName,
          role: accountRes.role,
          expiryAt: accountRes.expiryAt?.toString() || "",
          fullName: accountRes.fullName,
        });

        // Load existing permissions
        if (accountRes.permissions) {
          const perms = Array.isArray(accountRes.permissions)
            ? accountRes.permissions
            : JSON.parse(accountRes.permissions as string);
          setSelectedPermissions(perms);
        }
      } catch (error: any) {
        router.back();
      }
    };

    fetchAccount();
  }, [id, router]);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        showSuccess((state.message));
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        showError((state.message));
      }
    }
  }, [state, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: name === "promotionExtraDays" ? Number(value) : value,
    }));
  };

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const isPermissionSelected = (permission: Permission) => {
    return selectedPermissions.includes(permission);
  };


  const selectAllForModule = (moduleName: string, permissions: string[]) => {
    const allSelected = permissions.every((p) =>
      selectedPermissions.includes(p as Permission)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !permissions.includes(p))
      );
    } else {
      const newPerms = permissions.filter(
        (p) => !selectedPermissions.includes(p as Permission)
      );
      setSelectedPermissions((prev) => [
        ...prev,
        ...(newPerms as Permission[]),
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-fit group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            {t(translations.back)}
          </button>
          <div className="md:text-right">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t(translations.Edit, { name: t(translations.account) })}
            </h1>
            <p className="text-gray-500 text-sm mt-1">แก้ไขข้อมูลผู้ใช้งานและปรับเปลี่ยนสิทธิ์การเข้าถึง</p>
          </div>
        </div>

        <form
          className="space-y-8"
          action={(formData) => {
            formData.set("id", id);
            formData.set("permissions", JSON.stringify(selectedPermissions));

            return formAction(formData);
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Basic Info & Subscription */}
            <div className="lg:col-span-1 space-y-6">

              {/* Identity Section */}
              <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                  User Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t(translations.userName)} *</label>
                    <input
                      type="text"
                      name="userName"
                      value={formUser.userName}
                      onChange={handleChange}
                      required
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t(translations.fullName)}</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formUser.fullName}
                      onChange={handleChange}
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* Subscription Management */}
              <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
                  {t(translations.role)}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t(translations.role)} *</label>
                    <select
                      name="role"
                      value={formUser.role}
                      onChange={handleChange}
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>-- {t(translations.Select, { name: t(translations.role) })} --</option>
                      {Object.values(Role).map((role) => (
                        <option key={role} value={role}>{t(role)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Permissions Matrix */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col h-full border-b-0">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                      Access Control
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">จัดการสิทธิ์การใช้งานแต่ละโมดูลอย่างละเอียด</p>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                    {selectedPermissions.length} Active Permissions
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-1/3">Module</th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Create</th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">View</th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Update</th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {modules.map((module) => {
                        const allSelected = module.permissions.every((p) =>
                          selectedPermissions.includes(p as Permission)
                        );

                        return (
                          <tr key={module.name} className="hover:bg-indigo-50/40 transition-colors group">
                            <td className="px-6 py-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={() => selectAllForModule(module.name, module.permissions)}
                                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                                  {t(module.name)}
                                </span>
                              </label>
                            </td>
                            {["_CREATE", "_VIEW", "_UPDATE", "_DELETE"].map((actionType) => {
                              const permission = module.permissions.find((p) => p.includes(actionType));
                              return (
                                <td key={actionType} className="px-2 py-4 text-center">
                                  {permission ? (
                                    <input
                                      type="checkbox"
                                      checked={isPermissionSelected(permission as Permission)}
                                      onChange={() => togglePermission(permission as Permission)}
                                      className="w-5 h-5 text-indigo-500 border-gray-300 rounded-lg focus:ring-indigo-500 transition-all cursor-pointer"
                                    />
                                  ) : (
                                    <div className="flex justify-center items-center">
                                      <span className="inline-block w-3 h-[3px] bg-red-300 rounded-full" title="Not Available"></span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-[2rem]">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    {t(translations.Edit, { name: t(translations.account) })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}