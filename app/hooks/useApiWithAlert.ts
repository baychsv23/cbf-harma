"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { useAlert } from "./useAlert";

let lastErrorTime = 0;

export function useApiWithAlert() {
  const t = useTranslations();
  const { showSuccess, showError, showWarning, closeProcessing } = useAlert();
  const api = axios.create({
    timeout: 15000,
  });

  api.interceptors.response.use(
    (response) => {
      const message = response?.data?.message;
      const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(response.config.method?.toUpperCase() || "");
      if (message && isMutation) {
        showSuccess(t(message));
      }
      return response;
    },
    (error) => {
      const now = Date.now();
      if (now - lastErrorTime < 500) return Promise.reject(error);

      lastErrorTime = now;

      const status = error.response?.status;
      const serverError = error.response?.data?.error;

      if ([404, 403, 401, 409, 400].includes(status)) {
        showWarning(t(serverError));
      } else {
        showError(serverError);
      }

      return Promise.reject(error);
    },
  );

  return api;
}
