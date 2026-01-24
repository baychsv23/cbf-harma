"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  startTransition,
} from "react";
import { User, Shield, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAlert } from "@/app/hooks/useAlert";
import { changePassword } from "@/actions/changePassword";
import { initialState } from "@/lib/constant";
import { useAuth } from "@/app/hooks/useAuth";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";
import { Role } from "@/app/generated/prisma/enums";

export default function ProfilePage() {
  const t = useTranslations();
  const { user } = useAuth();
  const { showWarning, showSuccess, showProcessing, closeProcessing, showError } = useAlert();

  const [state, formAction, isPending] = useActionState(changePassword, initialState);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  const isMismatch = passwordData.confirmPassword !== "" && passwordData.newPassword !== passwordData.confirmPassword;
  const isMatch = passwordData.confirmPassword !== "" && passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword.length >= 6;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning(t(translations.passwordMismatch));
      return;
    }
    showProcessing();
    const formData = new FormData(e.currentTarget);
    startTransition(() => { formAction(formData); });
  };

  useEffect(() => {
    if (state.message) {
      closeProcessing();
      if (state.success) {
        showSuccess(t(state.message));
        setPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        showError(t(state.message));
      }
    }
  }, [state]);

  return (
    // ปรับ Padding ให้เล็กลงในมือถือ (px-4) และใหญ่ขึ้นใน Desktop (md:py-12)
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:py-12">
      <div className="max-w-xl mx-auto space-y-5 md:space-y-8">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            {t(translations.profile)}
          </h2>

          <div className="space-y-5">
            {/* ในมือถือจะเรียงเป็นแนวตั้ง (flex-col) ในคอมจะเรียงแนวนอน (sm:flex-row) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-slate-50 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t(translations.userName)}</span>
              <span className="text-slate-700 font-semibold text-lg">{user?.userName || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-slate-50 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t(translations.fullName)}</span>
              <span className="text-slate-700 font-semibold text-lg">{user?.fullName || "-"}</span>
            </div>
            {
              user?.role !== Role.USER && <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t(translations.role)}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase w-fit">
                  <Shield size={14} />
                  {user?.role ? t(user.role) : "-"}
                </span>
              </div>
            }

          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 md:p-8 relative overflow-hidden">
          {/* ตกแต่งเล็กน้อยให้ดูทันสมัย */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Lock size={80} />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            {t(translations.changePassword)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t(translations.newPassword)}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900"
                    placeholder="••••••••"
                    disabled={isPending}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t(translations.confirmNewPassword)}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl focus:ring-2 transition-all outline-none text-slate-900 ${isMismatch ? "border-red-400 ring-red-50 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"
                      }`}
                    placeholder="••••••••"
                    disabled={isPending}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Validation Text */}
                <div className="min-h-[24px] mt-2">
                  {isMismatch && (
                    <div className="flex items-center gap-1.5 text-red-500 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={14} />
                      <p className="text-xs font-bold">{t(translations.passwordMismatch)}</p>
                    </div>
                  )}
                  {isMatch && (
                    <div className="flex items-center gap-1.5 text-emerald-500 animate-in fade-in">
                      <CheckCircle2 size={14} />
                      <p className="text-xs font-bold">Passwords match</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || isMismatch || passwordData.newPassword.length < 6}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t(translations.processing)}
                </>
              ) : (
                t(translations.changePassword)
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}