"use server";

import { translations } from "./translation";

export async function handleAction<T>(
    action: () => Promise<T>,
    messages?: { successKey?: string; errorKey?: string },
    t?: (key: string) => string
) {
    try {
        const result = await action();

        return {
            success: true,
            message: messages?.successKey,
            data: result,
        };
    } catch (err: any) {
        let message = err.message || messages?.errorKey;
        // Prisma duplicate error
        if (t) {
            if (err.code === "P2002") {
                message = t(translations.duplicateData);
            }
            if (err.code === "P2025") message = t(translations.notFound);

            if (err.code === "P2003") message = t(translations.relatedRecord)
        }


        return {
            success: false,
            message,
        };
    }
}
