import { BooleanState } from "@/generated/prisma/enums";
import { getProducts } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, simpleResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
        const limit = parseInt(
            searchParams.get("limit") || DEFAULT_LIMIT.toString(),
        );
        const skip = (page - 1) * limit;
        const where: any = {
            isActive: BooleanState.TRUE,
        };
        const { data } = await getProducts({
            where,
            skip,
            limit,
            select: { id: true, nameLA: true, nameEN: true }
        });

        return NextResponse.json(simpleResponse(data));
    });
}