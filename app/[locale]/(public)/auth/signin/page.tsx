"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { signIn } from "next-auth/react";
import { useAlert } from "@/app/hooks/useAlert";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { Link } from "@/i18n/routing";

export default function PremiumLoginForm() {
  const t = useTranslations();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { showSuccess, showProcessing, showError, closeProcessing } =
    useAlert();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showProcessing();

    const result = await signIn("credentials", {
      redirect: false,
      userName,
      password,
    });
    closeProcessing();
    if (result?.ok) {
      showSuccess(t(translations.loginSuccessful));
      window.location.href = "/home";
    } else {
      showError(t(result?.error as string));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-secondary-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>

        {/* Login card */}
        <div className="relative bg-slate-900 bg-opacity-80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-secondary-500"></div>

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/50">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t(translations.signin)} CBF Pharma Co., Ltd
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div className="space-y-2">
                <label
                  htmlFor="userName"
                  className="text-sm font-medium text-slate-300 block"
                >
                  {t(translations.userName)}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "userName"
                          ? "text-purple-400"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  <input
                    id="userName"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t(translations.Placeholder, {
                      name: t(translations.userName),
                    })}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onFocus={() => setFocusedField("userName")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300 block"
                  >
                    {t(translations.password)}
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "password"
                          ? "text-purple-400"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={t(translations.Placeholder, {
                      name: t(translations.password),
                    })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 rounded-xl text-white font-semibold shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span>{t(translations.signin)}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Footer */}
          </div>

          {/* Bottom gradient accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
