"use client";

import { useState, useRef } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useAlert } from "@/app/hooks/useAlert";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/hooks/useAuth";
import { translations } from "@/lib/translation";
import { api } from "@/lib/axios";

export default function ProfilePage() {
  const { user } = useAuth();

  const { showWarning, showProcessing } = useAlert();
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!passwordData.currentPassword) {
      showWarning(
        t(translations.FiledRequired, {
          name: t(translations.currentPassword),
        }),
      );
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning(t(translations.passwordMisMatch));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    showProcessing();

    try {
      await api.post("/profile/change-password", passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      formRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t(translations.accountSettings)}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
              <div className="px-6 pb-6">
                <div className="-mt-12 mb-4 relative inline-block">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {user?.userName}
                </h2>
                <p className="text-sm text-slate-500 mb-6 capitalize">
                  {t(user?.role || "")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Change Password */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t(translations.changePassword)}
                  </h2>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {t(translations.currentPassword)}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-2"></div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {t(translations.newPassword)}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {t(translations.confirmNewPassword)}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all font-bold shadow-lg shadow-slate-200 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? t(translations.processing)
                      : t(translations.changePassword)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
