//api/products/list
import { BooleanState } from "@/generated/prisma/enums";
import { getProducts } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { selectDataOfProduct } from "@/lib/selectData";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
        const limit = parseInt(
            searchParams.get("limit") || DEFAULT_LIMIT.toString(),
        );
        const name = searchParams.get("name")
        const category = searchParams.get("category");
        const skip = (page - 1) * limit;
        const where: any = {
            isActive: BooleanState.TRUE,
        };
        if (category) where.category = category
        if (name) {
            where.OR = [
                { nameLA: { contains: name } },
                { nameEN: { contains: name } },
            ];
        }
        const { data, total } = await getProducts({
            where,
            skip,
            limit,
            select: selectDataOfProduct
        });

        return NextResponse.json(paginatedResponse(data, total, page, limit));
    });
}