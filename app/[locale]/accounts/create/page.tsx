"use client";

import { useActionState, useEffect, useState } from "react";
import { initialState, modules } from "@/lib/constant";
import { useTranslations } from "next-intl";

import { useAlert } from "@/app/hooks/useAlert";
import { useRouter } from "@/i18n/routing";
import { Permission, Role } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import { createAccount } from "@/action/accounts";

export default function CreateAccountPage() {
  const t = useTranslations();
  const [state, formAction] = useActionState(createAccount, initialState);
  const { showSuccess, showError, showProcessing } = useAlert();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    [],
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        showSuccess(state.message);
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        showError(state.message);
      }
    }
  }, [state, router]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const isPermissionSelected = (permission: Permission) => {
    return selectedPermissions.includes(permission);
  };

  // Define modules with their CRUD permissions

  const selectAllForModule = (moduleName: string, permissions: string[]) => {
    const allSelected = permissions.every((p) =>
      selectedPermissions.includes(p as Permission),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !permissions.includes(p)),
      );
    } else {
      const newPerms = permissions.filter(
        (p) => !selectedPermissions.includes(p as Permission),
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
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            {t(translations.back)}
          </button>
          <div className="md:text-right">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t(translations.Create, { name: t(translations.account) })}
            </h1>
          </div>
        </div>

        <form
          className="space-y-8"
          action={(formData) => {
            showProcessing();
            formData.set("permissions", JSON.stringify(selectedPermissions));

            return formAction(formData);
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: User Identity & Plan */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Section */}
              <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                  Account Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.userName)} *
                    </label>
                    <input
                      type="text"
                      name="userName"
                      required
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.fullName)} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.password)} *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Access & Plan Section */}
              <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
                  {t(translations.role)}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.role)} *
                    </label>
                    <select
                      name="role"
                      required
                      className="w-full mt-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        --{" "}
                        {t(translations.Select, { name: t(translations.role) })}{" "}
                        --
                      </option>
                      {Object.values(Role)
                        .filter((role) => role !== Role.USER)
                        .map((role) => (
                          <option key={role} value={role}>
                            {t(role)}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Permissions Matrix */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                      Module Permissions
                    </h3>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                    {selectedPermissions.length} Selected
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-1/3">
                          Module
                        </th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Create
                        </th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          View
                        </th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Update
                        </th>
                        <th className="px-2 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {modules.map((module) => {
                        const allSelected = module.permissions.every((p) =>
                          selectedPermissions.includes(p as Permission),
                        );

                        return (
                          <tr
                            key={module.name}
                            className="hover:bg-indigo-50/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={() =>
                                    selectAllForModule(
                                      module.name,
                                      module.permissions,
                                    )
                                  }
                                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                                  {t(module.name)}
                                </span>
                              </label>
                            </td>
                            {["_CREATE", "_VIEW", "_UPDATE", "_DELETE"].map(
                              (actionType) => {
                                const permission = module.permissions.find(
                                  (p) => p.includes(actionType),
                                );
                                return (
                                  <td
                                    key={actionType}
                                    className="px-2 py-4 text-center"
                                  >
                                    {permission ? (
                                      <input
                                        type="checkbox"
                                        checked={isPermissionSelected(
                                          permission as Permission,
                                        )}
                                        onChange={() =>
                                          togglePermission(
                                            permission as Permission,
                                          )
                                        }
                                        className="w-5 h-5 text-primary-600 border-gray-300 rounded-lg focus:ring-primary-600 transition-all cursor-pointer"
                                      />
                                    ) : (
                                      <div className="flex justify-center items-center">
                                        <span
                                          className="inline-block w-3 h-[3px] bg-red-300 rounded-full"
                                          title="Not Available"
                                        ></span>
                                      </div>
                                    )}
                                  </td>
                                );
                              },
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 mt-auto bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-10 py-3.5 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {t(translations.create)}
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
