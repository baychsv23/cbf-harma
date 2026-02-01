"use client";
import axios from "axios";
import { useAlert } from "./useAlert";
import { useLocale } from "next-intl";
let lastErrorTime = 0;

export function useApiWithAlert() {
  const { showSuccess, showError, showWarning } = useAlert();
  const locale = useLocale()
  const api = axios.create({
    timeout: 15000,
  });
  api.interceptors.request.use((config) => {
    config.params = {
      ...(config.params || {}),
      lang: locale
    };
    return config;
  })

  api.interceptors.response.use(
    (response) => {
      const message = response?.data?.message;
      const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
        response.config.method?.toUpperCase() || "",
      );
      if (message && isMutation) {
        showSuccess(message);
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
        showWarning(serverError);
      } else {
        showError(serverError);
      }

      return Promise.reject(error);
    },
  );

  return api;
}
