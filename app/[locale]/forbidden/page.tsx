"use client";

import { useRouter } from "@/i18n/routing";
import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ForbiddenPage() {
    const router = useRouter();
    const t = useTranslations("Forbidden")

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
            <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <Ban className="h-10 w-10 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {t("title")}
                </h1>

                <p className="text-gray-600 mb-6">
                    {t("description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
                    >
                        {t("goBack")}
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition"
                    >
                        {t("goHome")}
                    </button>
                </div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                {t("footer", { year: new Date().getFullYear() })}
            </p>
        </div>
    );
}
