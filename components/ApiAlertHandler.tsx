"use client";

import { useAlert } from "@/app/hooks/useAlert";
import { useEffect } from "react";

export function ApiAlertHandler() {
    const { showSuccess, showError } = useAlert();

    useEffect(() => {
        const handleSuccess = (e: any) => showSuccess(e.detail);
        const handleError = (e: any) => showError(e.detail);

        window.addEventListener('api-success', handleSuccess);
        window.addEventListener('api-error', handleError);

        return () => {
            window.removeEventListener('api-success', handleSuccess);
            window.removeEventListener('api-error', handleError);
        };
    }, [showSuccess, showError]);

    return null; // Component นี้ทำหน้าที่เป็นสมอง ไม่มีหน้าตา
}