"use client";

import { useActionState, useEffect, useState } from "react";
import { initialState, modules } from "@/lib/constant";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import { useAlert } from "@/app/hooks/useAlert";
import { useRouter } from "@/i18n/routing";
import { Permission, Role } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import { createAccount } from "@/action/accounts";

export default function CreateAccountPage() {
  const t = useTranslations();
  const [state, formAction] = useActionState(createAccount, initialState);
  const { showSuccess, showError, showProcessing, closeProcessing } = useAlert();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    [],
  );
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      closeProcessing();
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    const trimmedUser = formData.userName.trim().toLowerCase();
    if (!trimmedUser) {
      newErrors.userName = t(translations.FiledRequired, {
        name: t(translations.userName),
      });
    } else if (trimmedUser.length < 3) {
      newErrors.userName = `${t(translations.userName)} (min 3 chars)`;
    } else if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUser)) {
      newErrors.userName = `${t(translations.userName)} cannot contain spaces or special characters`;
    }

    // Full name validation
    const trimmedFull = formData.fullName.trim();
    if (!trimmedFull) {
      newErrors.fullName = t(translations.FiledRequired, {
        name: t(translations.fullName),
      });
    } else if (trimmedFull.length < 2) {
      newErrors.fullName = `${t(translations.fullName)} (min 2 chars)`;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t(translations.FiledRequired, {
        name: t(translations.password),
      });
    } else if (formData.password.length < 6) {
      newErrors.password = t(translations.passwordLength);
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(translations.FiledRequired, {
        name: t(translations.confirmNewPassword),
      });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(translations.passwordMisMatch);
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = t(translations.FiledRequired, {
        name: t(translations.role),
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          onSubmit={(e) => {
            if (!validate()) {
              e.preventDefault();
            }
          }}
          action={(submitData) => {
            if (!validate()) return;
            showProcessing();
            submitData.set("userName", formData.userName.trim().toLowerCase());
            submitData.set("fullName", formData.fullName.trim());
            submitData.set("password", formData.password);
            submitData.set("confirmPassword", formData.confirmPassword);
            submitData.set("role", formData.role);
            submitData.set("permissions", JSON.stringify(selectedPermissions));

            return formAction(submitData);
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
                  {/* Username */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.userName)} *
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/\s/g, "");
                        setFormData((prev) => ({ ...prev, userName: val }));
                        if (errors.userName) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.userName;
                            return next;
                          });
                        }
                      }}
                      className={`w-full mt-1.5 p-3 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${
                        errors.userName
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                      placeholder="e.g. john.doe"
                    />
                    {errors.userName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.userName}
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      {t(translations.fullName)} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }));
                        if (errors.fullName) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.fullName;
                            return next;
                          });
                        }
                      }}
                      className={`w-full mt-1.5 p-3 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${
                        errors.fullName
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                      placeholder="Full Name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        {t(translations.password)} *
                      </label>
                      <span className="text-[10px] text-gray-400">Min 6 chars</span>
                    </div>
                    <div className="relative mt-1.5">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }));
                          if (errors.password) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.password;
                              return next;
                            });
                          }
                        }}
                        className={`w-full p-3 pr-10 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${
                          errors.password
                            ? "border-red-500 bg-red-50/20 focus:border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        {t(translations.confirmNewPassword)} *
                      </label>
                      {formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                            <CheckCircle2 size={12} /> Matched
                          </span>
                        )}
                    </div>
                    <div className="relative mt-1.5">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }));
                          if (errors.confirmPassword) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.confirmPassword;
                              return next;
                            });
                          }
                        }}
                        className={`w-full p-3 pr-10 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${
                          errors.confirmPassword
                            ? "border-red-500 bg-red-50/20 focus:border-red-500"
                            : "border-gray-200 focus:border-indigo-500"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.confirmPassword}
                      </p>
                    )}
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
                      value={formData.role}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }));
                        if (errors.role) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.role;
                            return next;
                          });
                        }
                      }}
                      className={`w-full mt-1.5 p-3 bg-gray-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer ${
                        errors.role
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
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
                    {errors.role && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={13} /> {errors.role}
                      </p>
                    )}
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
