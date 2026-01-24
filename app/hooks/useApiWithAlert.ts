"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { useAlert } from "./useAlert";

let lastErrorTime = 0;

export function useApiWithAlert() {
    const t = useTranslations();
    const { showSuccess, showError, showWarning, closeProcessing } = useAlert()
    const api = axios.create({
        timeout: 15000,
    });


    api.interceptors.response.use(
        (response) => {
            const message = response?.data?.message;
            if (response.status === 201) {
                showSuccess(t(message))
            }
            return response;
        },
        (error) => {
            closeProcessing();
            const now = Date.now();
            if (now - lastErrorTime < 500) return Promise.reject(error);
            lastErrorTime = now;

            const status = error.response?.status;
            const message = error.response?.data?.error;

            if (status === 404) {
                showError(t(translations.notFound))

            }
            else if (status === 403) {
                showWarning(t(translations.forbidden))
            }
            else if (status === 401) {
                // เพิ่มกรณี Unauthorized (ถ้าต้องการ)
                showWarning(t(translations.unauthorized))
            }
            else if (status === 409) {
                showWarning(t(message || translations.unknown))
            } else {
                showError(t(translations.unknown))
            }

            return Promise.reject(error);
        }
    );

    return api;
}