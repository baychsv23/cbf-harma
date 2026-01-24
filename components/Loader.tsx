import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";

export default function Loader() {
  const t = useTranslations();
  return (
    <div className="flex flex-col justify-center items-center py-10 space-y-2">
      <div
        className="rounded-full animate-spin border-4 border-gray-300 border-t-blue-600"
        style={{ width: 12 * 4, height: 12 * 4 }}
      ></div>
      {translations.loading && (
        <span className="text-gray-500 text-sm">{t(translations.loading)}</span>
      )}
    </div>
  );
}
