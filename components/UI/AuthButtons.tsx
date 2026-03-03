"use client";

import { signOut } from "next-auth/react";
import { LogOut, LogIn, User, ChevronDown, UserPlus2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";

export default function AuthButtons() {
  const { user } = useAuth();
  const t = useTranslations();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          {/* ปรับขนาด Avatar เล็กลงนิดหน่อยบนมือถือ */}
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
            {user?.userName?.charAt(0).toUpperCase() || "U"}
          </div>
          {/* ซ่อนชื่อ User บนมือถือ (แสดงใน Dropdown แทน) */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900 leading-tight">
              {user?.userName}
            </span>
            <span className="text-[10px] text-gray-500 capitalize">
              {t(user?.role)}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {/* แสดงชื่อในห้ว Dropdown สำหรับ Mobile */}
            <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
              <p className="text-sm font-bold text-gray-900">{user?.userName}</p>
              <p className="text-xs text-gray-500">{t(user?.role)}</p>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              {t(translations.profile)}
            </Link>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
             signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
            >
              <LogOut className="w-4 h-4" />
              {t(translations.signout)}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 md:gap-3">
      {/* Sign In - ซ่อน text บนจอมือถือเล็กมากๆ (แคบกว่า 400px) */}
      <Link
        href="/auth/signin"
        className="flex items-center gap-2 px-2.5 py-2 md:px-4 md:py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-sm"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">{t(translations.signin)}</span>
      </Link>
    </div>
  );
}