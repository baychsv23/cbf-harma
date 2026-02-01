import { ArticleStatus, BooleanState } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { selectDataOfArticle } from "@/lib/selectData";
import { translations } from "@/lib/translation";

import { getPaginationParams, paginatedResponse } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const { page, limit } = getPaginationParams(searchParams);
        const title = searchParams.get("title");
        const type = searchParams.get("type");
        const skip = (page - 1) * limit;

        const where: any = {
            status: ArticleStatus.PUBLISHED
        };
        if (type) where.type = type;
        if (title) {
            where.OR = [
                { titleEN: { contains: title } },
                { titleLA: { contains: title } },
            ];
        }
        const { data, total } = await getArticles({
            where,
            skip,
            limit,
            select: selectDataOfArticle
        });
        return { message: t(translations.fetchSuccess), ...paginatedResponse(data, total, page, limit) };
    });
}