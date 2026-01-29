
import { getSymptoms } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
                { nameEN: { contains: name } },
                { nameLA: { contains: name } },
            ];
        }
        const skip = (page - 1) * limit;
        const { data, total } = await getSymptoms({
            limit,
            skip,
            select: { id: true, nameLA: true, nameEN: true }
        });
        return NextResponse.json(paginatedResponse(data, total, page, limit));
    });
}