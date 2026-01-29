import { BooleanState } from "@/generated/prisma/enums";
import { getAnnouncements } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { MAX_LIMIT, simpleResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const where: any = {
            isPublic: BooleanState.TRUE,
        };
        const { data } = await getAnnouncements({
            where,
            limit: MAX_LIMIT,
            include: { symptoms: true }
        });

        return NextResponse.json(simpleResponse(data));
    });
}