// app/articles/count-view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/prisma";
import { handleApiAction } from "@/lib/handleApiAction";
import { translations } from "@/lib/translation";
import { ApiError } from "@/lib/api-error";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getTranslations } from "next-intl/server";

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);
  const t = await getTranslations({
    locale,
  });
  return handleApiAction(async () => {
    const { slug } = await request.json();

    if (!slug) {
      throw new ApiError(translations.allFiledRequired, 400);
    }

    await database.product.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return {
      success: true,
      message: translations.fetchSuccess,
    };
  }, t);
}
