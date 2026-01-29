import { ArticleStatus, BooleanState } from "@/generated/prisma/enums";
import { getArticles } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { selectDataOfArticle } from "@/lib/selectData";

import { DEFAULT_LIMIT, DEFAULT_PAGE, simpleResponse } from "@/lib/utils/pagination";
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
            status: ArticleStatus.PUBLISHED
        };
        const { data } = await getArticles({
            where,
            skip,
            limit,
            select: selectDataOfArticle
        });
        return NextResponse.json(simpleResponse(data));
    });
}