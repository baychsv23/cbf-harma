// app/api/warehouses/route.ts

import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getAccounts } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { database } from "@/lib/prisma";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { DEFAULT_LIMIT, DEFAULT_PAGE, paginatedResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const session = await requirePermission(Permission.USER_VIEW)
        if (!session) throw new ApiError(translations.forbidden, 403)
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || DEFAULT_PAGE.toString());
        const limit = parseInt(
            searchParams.get("limit") || DEFAULT_LIMIT.toString(),
        );

        const where: any = {};

        // Pagination mode

        const skip = (page - 1) * limit;


        const { data, total } = await getAccounts({
            where,
            select: { id: true, userName: true, role: true, fullName: true, permissions: true, isActive: true },
            skip,
            limit,
        });
        return NextResponse.json(paginatedResponse(data, total, page, limit));
    })
}