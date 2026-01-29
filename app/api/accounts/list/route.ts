import { BooleanState, Permission } from "@/generated/prisma/enums";
import { ApiError } from "@/lib/api-error";
import { getAccounts } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { requirePermission } from "@/lib/requirePermission";
import { translations } from "@/lib/translation";
import { MAX_LIMIT, simpleResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const session = await requirePermission(Permission.USER_VIEW)
        if (!session) throw new ApiError(translations.forbidden, 403)
        const where: any = {
            isActive: BooleanState.TRUE,
        };
        const { data } = await getAccounts({
            where,
            limit: MAX_LIMIT,
            include: { symptoms: true }
        });

        return NextResponse.json(simpleResponse(data));
    });
}