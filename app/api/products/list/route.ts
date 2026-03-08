//api/products/list
import { BooleanState } from "@/generated/prisma/enums";
import { getProducts } from "@/lib/getData";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { handleApiAction } from "@/lib/handleApiAction";
import { selectDataOfProduct } from "@/lib/selectData";
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
        const name = searchParams.get("name")
        const category = searchParams.get("category");
        const skip = (page - 1) * limit;
        const where: any = {
            isActive: BooleanState.TRUE,
        };
        if (category) where.category = category
        if (name) {
            where.OR = [
      { nameLA: { contains: name, mode: 'insensitive' } },
        { nameEN: { contains: name, mode: 'insensitive' } },
            ];
        }
        const { data, total } = await getProducts({
            where,
            skip,
            limit,
            select: selectDataOfProduct
        });

        return { message: t(translations.fetchSuccess), ...paginatedResponse(data, total, page, limit) };
    });
}