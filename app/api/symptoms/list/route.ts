
import { getSymptoms } from "@/lib/getData";
import { handleApiAction } from "@/lib/handleApiAction";
import { MAX_LIMIT, simpleResponse } from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return handleApiAction(async () => {
        const { data } = await getSymptoms({
            limit: MAX_LIMIT,
            select: { id: true, nameLA: true, nameEN: true }
        });
        return NextResponse.json(simpleResponse(data));
    });
}