"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;
  const t = useTranslations();

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex gap-1 md:gap-2">
      {/* ปุ่มภาษาไทย */}
      <button
        onClick={() => handleLanguageChange("en")}
        className={`flex items-center px-2 py-2 md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${currentLocale === "en"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        <span className="fi fi-us md:mr-2"></span> {/* ธงโชว์ทั้งคู่ แต่เว้นระยะ mr-2 แค่บน desktop */}
        <span className="hidden md:inline">{t(translations.english)}</span>
      </button>

      {/* ปุ่มภาษาลาว */}
      <button
        onClick={() => handleLanguageChange("lo")}
        className={`flex items-center px-2 py-2 md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${currentLocale === "lo"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        <span className="fi fi-la md:mr-2"></span>
        <span className="hidden md:inline">{t(translations.lao)}</span>
      </button>
    </div>
  );
}