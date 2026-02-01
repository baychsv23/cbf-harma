
import { BooleanState, ImageType } from "@/generated/prisma/enums";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { translations } from "@/lib/translation";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {

        const [banners, announcement] = await Promise.all([
            database.announcement.findMany({
                where: {
                    type: ImageType.BANNER,
                    isPublic: BooleanState.TRUE,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            }),

            database.announcement.findFirst({
                where: {
                    type: ImageType.ANNOUNCEMENT,
                    isPublic: BooleanState.TRUE,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        return {
            message: t(translations.fetchSuccess),
            data: {
                banners,
                announcement,
            },
        }
    });
}
