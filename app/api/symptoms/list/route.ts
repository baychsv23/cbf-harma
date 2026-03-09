
import { getSymptoms } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { translations } from "@/lib/translation";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { getTranslations } from "next-intl/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const locale = getRequestLocale(request);
    const t = await getTranslations({
        locale,
    });
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
        const limit = parseInt(
            searchParams.get("limit") || DEFAULT_LIMIT.toString(),
        );
        const where: any = {};
        const name = searchParams.get("name")

        if (name) {
            where.OR = [
                { nameEN: { contains: name, mode: 'insensitive' } },
                { nameLA: { contains: name, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const { data, total } = await getSymptoms({
            limit,
            skip,
            select: { id: true, nameLA: true, nameEN: true }
        });
        return { message: t(translations.fetchSuccess), ...paginatedResponse(data, total, page, limit) };
    });
}