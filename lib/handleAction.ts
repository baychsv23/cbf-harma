"use server";

import { translations } from "./translation";

export async function handleAction<T>(
  action: () => Promise<T>,
  messages?: { successKey?: string; errorKey?: string }
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
    if (err.code === "P2002") {
      message = translations.duplicate;
    }
    if (err.code === "P2025") message = translations.notFound;
    if (err.code === "P2003") {
      message = translations.cannotDeleteAndUpdate;
    }
    // if (err.code === "P2024") {
    //   message = translations.unknown;
    // }
    return {
      success: false,
      message,
    };
  }
}
