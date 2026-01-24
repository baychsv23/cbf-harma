"use client";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";

export function useAlert() {
  const t = useTranslations();

  // Helper สำหรับจัดการ Theme สีพื้นฐาน
  const commonOptions = {
    background: "#ffffff",
    backdrop: `rgba(0,0,0,0.4)`,
    customClass: {
      popup: "rounded-3xl shadow-2xl border border-gray-100", // ปรับความโค้งให้ดู modern ขึ้น
      title: "text-2xl font-bold text-gray-800",
      htmlContainer: "text-gray-600 text-lg",
      confirmButton: "px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200",
      cancelButton: "px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200",
    },
  };

  const showSuccess = (message: string) => {
    Swal.fire({
      ...commonOptions,
      icon: "success",
      title: t(translations.success),
      text: message,
      confirmButtonColor: "#10b981",
      confirmButtonText: t(translations.confirm),
      showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
    });
  };

  const showError = (message: string) => {
    Swal.fire({
      ...commonOptions,
      icon: "error",
      title: t(translations.error),
      text: message,
      confirmButtonColor: "#ef4444",
      confirmButtonText: t(translations.confirm),
      showClass: { popup: "animate__animated animate__shakeX animate__faster" },
    });
  };

  const showWarning = (message: string) => {
    Swal.fire({
      ...commonOptions,
      icon: "warning",
      title: t(translations.warning),
      text: message,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: t(translations.confirm),
      showClass: { popup: "animate__animated animate__headShake animate__faster" },
    });
  };

  const showProcessing = (msg?: string) => {
    Swal.fire({
      title: t(translations.processing),
      html: `<div class='text-gray-500 mt-2'>${msg || 'ກຳລັງປະມວນຜົນ...'}</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "text-xl font-bold text-gray-800",
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const showConfirm = async (message: string): Promise<boolean> => {
    const result = await Swal.fire({
      ...commonOptions,
      title: t(translations.yesOrNo),
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t(translations.submit),
      cancelButtonText: t(translations.cancel),
    });
    return result.isConfirmed;
  };

  const closeProcessing = () => {
    if (Swal.isVisible()) {
      Swal.close();
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showProcessing,
    showConfirm,
    closeProcessing,
  };
}